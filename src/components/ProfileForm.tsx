"use client";

import { updateProfile } from "@/app/profile/actions";
import { useActionState } from "react";

export default function ProfileForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, {});
  return (
    <form action={formAction} className="space-y-3">
      <label className="block">Name</label>
      <input name="name" defaultValue={name} required />

      <label className="block">Email (cannot be changed)</label>
      <input value={email} disabled readOnly />

      {state?.error && <p>{state.error}</p>}
      {state.message && <p>{state.message}</p>}

      <button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
