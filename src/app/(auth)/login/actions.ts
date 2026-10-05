"use server";

import { signToken } from "@/lib/auth";
import { db } from "@/prisma/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(
  prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await db.orm.public.User.where({ email }).first();
  if (!user) {
    return { error: "User doesn't exist, please register" };
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return { error: "Invalid Credentials" };
  }

  const token = signToken(user.id);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // HTTPS-only in production
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // another option
  // localStorage.setItem("session", token);

  redirect("/");
}
