import { registerUser } from "./actions";

export default function RegisterPage() {
  return (
    <form action={registerUser}>
      <input name="name" placeholder="Full Name" required />
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Regsiter</button>
    </form>
  );
}
