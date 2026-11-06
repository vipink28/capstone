import OrderStatusBadge from "@/components/OrderStatusBadge";
import { formatPrice } from "@/lib/format";
import { isOrderStatus, ORDER_STATUSES } from "@/lib/orders";
import { requireAdmin, requireAuth } from "@/lib/session";
import { db } from "@/prisma/db";
import { all, and } from "@prisma/orm-postgres/orm-client";
import Link from "next/link";

const PAGE_SIZE = 2;

export default async function OrdresPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; before?: string }>;
}) {
  const user = await requireAuth();
  const { status, before } = await searchParams;

  const statusFilter = isOrderStatus(status) ? status : null;
  const beforeNumber = Number(before);
  const cursor =
    Number.isInteger(beforeNumber) && beforeNumber > 0 ? beforeNumber : null;

  const rows = await db.orm.public.Order.where({ userId: user.id })
    .where((o) =>
      and(
        statusFilter ? o.status.eq(statusFilter) : all(),
        cursor ? o.id.lt(cursor) : all(),
      ),
    )
    .include("orderItems", (items) => items.count())
    .orderBy((o) => o.id.desc())
    .limit(PAGE_SIZE + 1)
    .all();

  const hasMore = rows.length > PAGE_SIZE;
  const orders = rows.slice(0, PAGE_SIZE);
  const { totalOrders } = await db.orm.public.Order.where({
    userId: user.id,
  }).aggregate((o) => ({ totalOrders: o.count() }));

  const nextParams = new URLSearchParams();

  if (statusFilter) nextParams.set("status", statusFilter);
  if (orders.length > 0)
    nextParams.set("before", String(orders[orders.length - 1].id));

  return (
    <div className="space-y-4">
      <h1>My Orders</h1>
      <p>
        {totalOrders} order{totalOrders === 1 ? "" : "s"} in total
      </p>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/orders"
          className={`px-3 py-1 rounded border ${!statusFilter ? "bg-amber-800" : ""}`}
        >
          All
        </Link>

        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/orders?status=${s}`}
            className={`px-3 py-1 rounded border ${statusFilter === s ? "bg-amber-800" : ""}`}
          >
            {s}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p>
          {statusFilter
            ? `No orders with ${statusFilter.toLocaleLowerCase()} status`
            : "You haven't palced any orders yet"}
        </p>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/orders/${o.id}`}>
                <div>
                  <p>Order #{o.id}</p>
                  <p>
                    {o.createdAt} - {o.orderItems} items{" "}
                  </p>
                </div>
                <div className="space-y-1">
                  <OrderStatusBadge status={o.status} />
                  <p>Total:{formatPrice(o.total)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <Link href={`/orders?${nextParams.toString()}`}>Older orders</Link>
      )}
    </div>
  );
}
