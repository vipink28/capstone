"use client";

import { logoutUser } from "./actions";

export default function LogoutButton() {
  return <button onClick={logoutUser}>Logout</button>;
}
