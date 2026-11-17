import { startPaymentSession } from "@/app/payments/actions";
import PayButton from "@/components/PayButton";
import { formatPrice } from "@/lib/format";
import { toPaise } from "@/lib/razorpay-signature";
import { requireAuth } from "@/lib/session";
import { db } from "@/prisma/db";
import { notFound, redirect } from "next/navigation";

export default async function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;

  const orderId = Number(id);
  if (orderId === null) notFound();

  const order = await db.orm.public.Order.where({
    id: orderId,
    userId: user.id,
  }).first();

  if (!order) notFound();

  if (order.PaymentMethod !== "ONLINE" || order.status !== "PENDING") {
    redirect(`/orders/${order.id}`);
  }

  return (
    <div className="max-w-md space-y-4">
      <h1>Pay for order #1</h1>
      <p>Amount: {formatPrice(12)}</p>

      {order.razorpayOrderId ? (
        <PayButton
          orderId={order.id}
          keyId={process.env.RAZORPAY_KEY_ID!}
          razorpayOrderId={order.razorpayOrderId}
          amountInPaise={toPaise(order.total)}
          customerName={user.name}
          customerEmail={user.email}
        />
      ) : (
        <form action={startPaymentSession.bind(null, order.id)}>
          <p>We could not start the payment session. Please try again</p>
          <button type="submit" className="px-4 py-2 border rounded">
            Try again
          </button>
        </form>
      )}
    </div>
  );
}
