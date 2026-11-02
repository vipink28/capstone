import AddressForm from "@/components/AddressForm";
import CheckoutForm from "@/components/CheckoutForm";
import { calculateTotal, getCartItems } from "@/lib/cart";
import { requireAuth } from "@/lib/session";
import { db } from "@/prisma/db";

export default async function CheckoutPage() {
  const user = await requireAuth();
  const { items } = await getCartItems(user.id);

  const addresses = await db.orm.public.Address.where({ userId: user.id })
    .orderBy((a) => a.id.asc())
    .all();

  return (
    <div>
      <div>
        <CheckoutForm addresses={addresses} />
        <AddressForm />
      </div>
      <div className="border rounded p-4 h-fit">
        <h2 className="text-lg">Order Summary</h2>
        <ul className="text-sm space-y-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between border-b border-b-violet-300 py-4"
            >
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>{item.product.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <p className="font-semibold mt-3">Total: {calculateTotal(items)}</p>
      </div>
    </div>
  );
}
