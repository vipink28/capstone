"use client";

import { useFormStatus } from "react-dom";

export default function AddToCartButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={disabled || pending}
      className="bg-amber-600 px-8 py-2 disabled:opacity-40"
    >
      {pending ? "Adding" : "Add To Cart"}
    </button>
  );
}
