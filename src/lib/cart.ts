import { db } from "@/prisma/db";
interface CartItem {
  quantity: number;
  product: { price: number };
}

export const MAX_QUANTITY = 10;
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

export async function getCartItems(userId: number) {
  const cart = await getOrCreateCart(userId);
  const items = await db.orm.public.CartItem.include("product")
    .where({
      cartId: cart.id,
    })
    .orderBy((i) => i.id.asc())
    .all();

  return { cart, items };
}

export function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
}
