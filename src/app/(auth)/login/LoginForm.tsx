"use client";

import { useActionState } from "react";
import { loginUser } from "./actions";

const initialState = { error: undefined };
export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState,
  );
  return (
    <form action={formAction}>
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button type="submit">{isPending ? "Logging In..." : "Login"}</button>
    </form>
  );
}
