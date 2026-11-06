"use client";
import { changePassword } from "@/app/profile/actions";
import { useActionState } from "react";
export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, {});

  return (
    <form action={formAction} className="space-y-3">
      <label className="block">Current Password</label>
      <input name="currentPassword" type="password" required />

      <label className="block">New Password</label>
      <input name="newPassword" type="password" required />

      <label className="block">Confirm Password</label>
      <input name="confirmPassword" type="password" required />

      {state?.error && <p>{state.error}</p>}
      {state.message && <p>{state.message}</p>}

      <button type="submit" disabled={pending}>
        {pending ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
}
