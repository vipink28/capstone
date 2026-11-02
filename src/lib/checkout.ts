export const PAYMENT_METHODS = ["CASH_ON_DELIVERY", "UPI", "CARD"] as const; // this will make the array read only. 0 = "CASH_ON_DELIVERY"

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH_ON_DELIVERY: "Cash on Delivery",
  UPI: "UPI",
  CARD: "Credit/Debit Card",
};

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return (
    typeof value === "string" &&
    PAYMENT_METHODS.includes(value as PaymentMethod)
  );
}

export type CheckoutParseResult =
  | { ok: false; error: string }
  | { ok: true; addressId: number; paymentMethod: PaymentMethod };

export function parseCheckoutForm(formData: FormData): CheckoutParseResult {
  const addressId = Number(formData.get("addressId"));
  const paymentMethod = formData.get("paymentMethod");

  if (!Number.isInteger(addressId) || addressId <= 0) {
    return { ok: false, error: "Please choose a delivery address" };
  }
  if (!isPaymentMethod(paymentMethod)) {
    return { ok: false, error: "Please select a valid payment method" };
  }
  return { ok: true, addressId, paymentMethod };
}
