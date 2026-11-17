import "server-only";
import { db } from "@/prisma/db";
import { getRazorpay } from "./razorpay";
import { toPaise } from "./razorpay-signature";

export async function ensureRazorpayOrder(
  orderId: number,
): Promise<string | null> {
  const order = await db.orm.public.Order.where({ id: orderId }).first();

  if (
    !order ||
    order.PaymentMethod !== "ONLINE" ||
    order.status !== "PENDING"
  ) {
    return null;
  }
  if (order.razorpayOrderId) {
    return order.razorpayOrderId;
  }

  const created = await getRazorpay().orders.create({
    amount: toPaise(order.total),
    currency: "INR",
    receipt: `order_${order.id}`,
    notes: { orderId: String(order.id) },
  });

  await db.orm.public.Order.where({ id: order.id }).update({
    razorpayOrderId: created.id,
  });

  return created.id;
}

export async function markOrderAsPaid(
  razorpayOrderId: string,
  razorpayPaymentId: string,
) {
  return db.orm.public.Order.where({
    razorpayOrderId,
    status: "PENDING",
  }).update({ status: "PAID", razorpayPaymentId });
}
