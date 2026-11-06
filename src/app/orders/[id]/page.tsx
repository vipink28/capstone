import { formatPrice } from "@/lib/format";
import { requireAuth } from "@/lib/session";
import { db } from "@/prisma/db";
import { notFound } from "next/navigation";
import { cancelOrder } from "../actions";
import OrderStatusBadge from "@/components/OrderStatusBadge";

export default async function OrderPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireAuth();

  const { id } = await params;

  const order = await db.orm.public.Order.where({ id: Number(id) }).first();
  if (!order || order.userId !== user.id) {
    notFound();
  }

  const isOwner = order?.userId === user.id;
  const isAdmin = user.role === "ADMIN";

  // fix later
  // if (!isOwner && !isAdmin) {
  //   notFound();
  // }

  const items = await db.orm.public.OrderItem.include("product")
    .where({
      orderId: order.id,
    })
    .orderBy((i) => i.id.asc())
    .all();

  return (
    <div className="p-6 max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      <p className="text-sm text-gray-200">
        Placed on {order.createdAt} - <OrderStatusBadge status={order.status} />
      </p>

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.product.name} x {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="font-semibold">Total: {formatPrice(order.total)}</p>

      <div>
        <h2 className="font-semibold">Delivering To</h2>
        <p>{order.addressText}</p>
      </div>

      {order.userId === user.id && order.status === "PENDING" && (
        <form action={cancelOrder.bind(null, order.id)}>
          <button type="submit">Cancel this order</button>
        </form>
      )}
    </div>
  );
}
