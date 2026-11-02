"use client";
import { placeOrder } from "@/app/checkout/actions";
import { PAYMENT_LABELS, PAYMENT_METHODS } from "@/lib/checkout";
import { useActionState } from "react";

interface AddressOptionProps {
  id: number;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  phone: string;
  postalCode: string;
}

export default function CheckoutForm({
  addresses,
}: {
  addresses: AddressOptionProps[];
}) {
  const [state, formAction, pending] = useActionState(placeOrder, {});
  return (
    <form action={formAction} className="border rounded p-4 space-y-4">
      <fieldset>
        <legend>Delivery Address</legend>
        {addresses.length === 0 && <p>Add an address below to continue</p>}
        {addresses.map((a, index) => (
          <label key={a.id} className="flex gap-2 items-start py-1">
            <input
              type="radio"
              name="addressId"
              value={a.id}
              defaultChecked={index === 0}
            />
            <span className="text-sm">
              {a.fullName}, {a.line1}, {a?.line2}, {a.city}, {a.state},{" "}
              {a.postalCode}, {a.phone}
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Payment method</legend>
        {PAYMENT_METHODS.map((method, index) => (
          <label key={method} className="flex gap-2 py-1">
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              defaultChecked={index === 0}
            />
            <span className="text-sm">{PAYMENT_LABELS[method]}</span>
          </label>
        ))}
      </fieldset>
      {state?.error && <p>{state.error}</p>}
      {state?.message && <p>{state.message}</p>}
      <button disabled={pending || addresses.length === 0} type="submit">
        {pending ? "Placing Order" : "Place Order"}
      </button>
    </form>
  );
}
