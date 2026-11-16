import { db } from "@/prisma/db";
import "server-only";

export async function ensureRazorpayOrder(
  orderId: number,
): Promise<string | null> {
  const order = await db.orm.public.Order.where({ id: orderId }).first(); 

  if(!order || order.PaymentMethod !== "")

}
