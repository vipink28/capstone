"use server";

import { ensureRazorpayOrder, markOrderAsPaid } from "@/lib/payments";
import { verifyPaymentSignature } from "@/lib/razorpay-signature";
import { requireAdmin, requireAuth } from "@/lib/session";
import { db } from "@/prisma/db";
import { ok } from "assert";
import { error } from "console";
import { revalidatePath } from "next/cache";

export async function startPaymentSession(orderId: number) {
  const user = await requireAuth();

  const order = await db.orm.public.Order.where({
    id: orderId,
    userId: user.id,
  }).first();

  if (!order) return;

  await ensureRazorpayOrder(order.id);
  revalidatePath(`/orders/${orderId}/pay`);
}

type ConfirmResult = { ok: true } | { ok: false; error: string };
export async function confirmPayment(
  orderId: number,
  response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  },
): Promise<ConfirmResult> {
  const user = await requireAuth();
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return { ok: false, error: "Payments are not configured" };
  }

  const order = await db.orm.public.Order.where({
    id: orderId,
    userId: user.id,
  }).first();

  if (!order || !order.razorpayOrderId) {
    return { ok: false, error: "Order not found" };
  }

  const paymentId = String(response.razorpay_order_id ?? "");
  const signature = String(response.razorpay_signature ?? "");

  const valid = verifyPaymentSignature(
    keySecret,
    order.razorpayOrderId,
    paymentId,
    signature,
  );

  if (!valid) {
    return { ok: false, error: "We couldn't verify this payment" };
  }

  await markOrderAsPaid(order.razorpayOrderId, paymentId);
  revalidatePath(`/order/${order.id}`);
  revalidatePath(`/orders`);

  return { ok: true };
}
