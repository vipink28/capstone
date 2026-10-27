import { calculateTotal, getCartItems, MAX_QUANTITY } from "@/lib/cart";
import { requireAuth } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import { changeQuantity, clearCart, removeFromCart } from "./actions";

export default async function CartPage() {
  const user = await requireAuth();
  const { items } = await getCartItems(user.id);

  if (items.length === 0) {
    return (
      <div className="p-4">
        <p>Your Cart is empty</p>
        <Link href="/products">Browse Products</Link>
      </div>
    );
  }

  const total = calculateTotal(items);
  const hasUnavailable = items.some((item) => !item.product.inStock);
  console.log(hasUnavailable);
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">Your Cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 justify-between">
            <div className="flex gap-4">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                width={200}
                height={200}
              />
              <h3 className="text-2xl font-semibold">{item.product.name}</h3>
              {!item.product.inStock && (
                <p>The item is out of stock - remove it to checkout</p>
              )}
              <p>
                {item.product.price} x {item.quantity}
              </p>
              <div className="flex items-center gap-3">
                <form action={changeQuantity.bind(null, item.id, -1)}>
                  <button>-</button>
                </form>
                <span>{item.quantity}</span>
                <form action={changeQuantity.bind(null, item.id, +1)}>
                  <button disabled={item.quantity >= MAX_QUANTITY}>+</button>
                </form>
              </div>
            </div>
            <form action={removeFromCart.bind(null, item.id)}>
              <button type="submit">Remove</button>
            </form>
          </div>
        ))}
      </div>
      <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
      <form action={clearCart}>
        <button>Clear Cart</button>
      </form>

      {hasUnavailable ? (
        <p>Remove Unavailable items to continue</p>
      ) : (
        <Link href="/checkout">Proceed to Checkout</Link>
      )}
    </div>
  );
}
