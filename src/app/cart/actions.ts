"use server";

import { getOrCreateCart, MAX_QUANTITY } from "@/lib/cart";
import { requireAuth } from "@/lib/session";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: number) {
  const user = await requireAuth();
  const product = await db.orm.public.Product.first({ id: productId });
  if (!product || !product.inStock) return;

  const cart = await getOrCreateCart(user.id);
  // read then write

  await db.transaction(async (tx) => {
    const existing = await tx.orm.public.CartItem.where({
      cartId: cart.id,
      productId,
    }).first();

    if (existing) {
      await tx.orm.public.CartItem.where({ id: existing.id }).update({
        quantity: existing.quantity + 1,
      });
    } else {
      await tx.orm.public.CartItem.create({
        cartId: cart.id,
        productId,
        quantity: 1,
      });
    }
  });
  revalidatePath("/", "layout");
}

export async function changeQuantity(cartItemId: number, changeVal: 1 | -1) {
  const user = await requireAuth();
  const cart = await getOrCreateCart(user.id);

  await db.transaction(async (tx) => {
    const item = await tx.orm.public.CartItem.where({
      id: cartItemId,
      cartId: cart.id,
    }).first();

    if (!item) return;
    const next = item.quantity + changeVal;
    if (next <= 0) {
      await tx.orm.public.CartItem.where({ id: item.id }).delete();
    } else if (next <= MAX_QUANTITY) {
      await tx.orm.public.CartItem.where({ id: item.id }).update({
        quantity: next,
      });
    }
  });
  revalidatePath("/", "layout");
}

export async function removeFromCart(cartItemId: number) {
  const user = await requireAuth();
  const cart = await getOrCreateCart(user.id);

  await db.orm.public.CartItem.where({
    id: cartItemId,
    cartId: cart.id,
  }).delete();
  revalidatePath("/", "layout");
}

export async function clearCart() {
  const user = await requireAuth();
  const cart = await getOrCreateCart(user.id);
  await db.orm.public.CartItem.where({ cartId: cart.id }).deleteAndCount();
  revalidatePath("/", "layout");
}
