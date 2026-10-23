import { db } from "@/prisma/db";

export async function getOrCreateCart(userId: number) {
  const existing = await db.orm.public.Cart.first({ userId });
  if (existing) return existing;
  return db.orm.public.Cart.create({ userId });
}

// Total number of items in the cart for the header badge.
export async function getCartCount(userId: number): Promise<number> {
  const cart = await db.orm.public.Cart.first({ userId });
  if (!cart) return 0;
  const { total } = await db.orm.public.CartItem.where({
    cartId: cart.id,
  }).aggregate((agg) => ({ total: agg.count() }));
  return total ?? 0;
}
