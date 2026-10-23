import { getOrCreateCart } from "@/lib/cart";
import { requireAuth } from "@/lib/session";
import { db } from "@/prisma/db";
import Image from "next/image";
import Link from "next/link";
import { removeFromCart } from "./actions";

export default async function CartPage() {
  const user = await requireAuth();
  const cart = await getOrCreateCart(user.id);

  const items = await db.orm.public.CartItem.include("product")
    .where({
      cartId: cart.id,
    })
    .orderBy((i) => i.id.asc())
    .all();

  if (items.length === 0) {
    return (
      <div className="p-4">
        <p>Your Cart is empty</p>
        <Link href="/products">Browse Products</Link>
      </div>
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">Your Cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div>
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                width={200}
                height={200}
              />
              <h3 className="text-2xl font-semibold">{item.product.name}</h3>
              <p>
                {item.product.price} x {item.quantity}
              </p>
            </div>
            <form action={removeFromCart.bind(null, item.product.id)}>
              <button type="submit">Remove</button>
            </form>
          </div>
        ))}
      </div>
      <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
    </div>
  );
}
