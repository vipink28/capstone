"use client";
import { confirmPayment } from "@/app/payments/actions";
import { useRouter } from "next/router";
import Script from "next/script";
import { useState } from "react";

interface PayButtonProps {
  orderId: number;
  keyId: string;
  razorpayOrderId: string;
  amountInPaise: number;
  customerName: string;
  customerEmail: string;
}

export default function PayButton({
  orderId,
  keyId,
  razorpayOrderId,
  amountInPaise,
  customerName,
  customerEmail,
}: PayButtonProps) {
  const router = useRouter();
  const [scriptReady, setScriptReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function openCheckout() {
    setMessage(null);
    setBusy(true);

    const checkout = new window.Razorpay({
      key: keyId,
      amount: amountInPaise,
      currency: "INR",
      name: "My Store",
      description: `Order #${orderId}`,
      order_id: razorpayOrderId,
      prefill: { name: customerName, email: customerEmail },
      theme: { color: "#fcba03" },
      modal: {
        confirm_close: true,
        ondismiss: () => setBusy(false),
      },
      handler: async (response) => {
        const result = await confirmPayment(orderId, response);
        if (result.ok) {
          router.push(`/orders/${orderId}`);
        } else {
          setMessage(result.error);
          setBusy(false);
        }
      },
    });

    checkout.on("payment.failed", (failure) => {
      setMessage(
        `Payment fialed: ${failure.error.description}, You can try again`,
      );
      setBusy(false);
    });

    checkout.open();
  }

  return (
    <div className="space-y-3">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onReady={() => {
          setScriptReady(true);
        }}
      />

      <button
        type="button"
        onClick={openCheckout}
        disabled={!scriptReady || busy}
        className="px-6 py-2 bg-amber-800 rounded disabled:opacity-40"
      >
        {busy ? "Waiting for payment..." : "Pay Now"}
      </button>
      {message && <p className="text-red-600">{message}</p>}
    </div>
  );
}
