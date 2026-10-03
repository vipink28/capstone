"use server";
import { db } from "@/prisma/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function registerUser(
  prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  const existingUser = await db.orm.public.User.where({ email }).first();
  if (existingUser) {
    return { error: "An account with this email is already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.orm.public.User.create({
    name,
    email,
    password: hashedPassword,
  });

  const newUser = await db.orm.public.User.where({ email }).first();
  if (newUser) {
    await db.orm.public.Cart.create({ userId: newUser.id });
    await db.orm.public.Wishlist.create({ userId: newUser.id });
  }
  redirect("/login");
}
