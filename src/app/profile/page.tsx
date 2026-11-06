import PasswordForm from "@/components/PasswordForm";
import ProfileForm from "@/components/ProfileForm";
import { requireAuth } from "@/lib/session";
import { db } from "@/prisma/db";
import { deleteAddress } from "./actions";
import Link from "next/link";
import { logoutUser } from "../(auth)/logout/actions";

export default async function ProfilePage() {
  const user = await requireAuth();
  const addresses = await db.orm.public.Address.where({ userId: user.id })
    .orderBy((a) => a.id.desc())
    .all();

  return (
    <div className="space-y-8 max-w-3xl">
      <h1>My Profile</h1>
      <section className="space-y-3">
        <p>Member since {user.createdAt}</p>
        <ProfileForm name={user.name} email={user.email} />
      </section>

      <section className="space-y-3">
        <h2>Change Password</h2>
        <PasswordForm />
      </section>
      {addresses.length === 0 ? (
        <p>No saved address yet. You can add one at checkout</p>
      ) : (
        <ul>
          {addresses.map((a) => (
            <li key={a.id} className="flex justify-between items-start">
              <span>
                {a.fullName}, {a.line1}, {a?.line2}, {a.city}, {a.state},{" "}
                {a.phone}, {a.postalCode}
              </span>
              <form action={deleteAddress.bind(null, a.id)}>
                <button>Delete</button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <section>
        <Link href="/orders"> View my orders</Link>
        <form action={logoutUser}>
          <button type="submit">Log Out</button>
        </form>
      </section>
    </div>
  );
}
