"use server";

import { ALLOWED_TRANSITIONS, isOrderStatus } from "@/lib/orders";
import { requireAdmin, requireAuth } from "@/lib/session";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function cancelOrder(orderId: number) {
  const user = await requireAuth();
  await db.orm.public.Order.where({
    id: orderId,
    userId: user.id,
    status: "PENDING",
  }).update({ status: "CANCELLED" });
  revalidatePath(`/orders/${orderId}`);
}

export async function updateOrderStatus(orderId: number, formData: FormData) {
  await requireAdmin();
  const next = formData.get("status");
  if (!isOrderStatus(next)) return;

  const order = await db.orm.public.Order.where({ id: orderId }).first();
  if (!order) return;

  if (!ALLOWED_TRANSITIONS[order.status].includes(next)) return;
  await db.orm.public.Order.where({ id: orderId }).update({ status: next });
  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${orderId}`);
}
