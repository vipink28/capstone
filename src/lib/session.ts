import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { db } from "@/prisma/db";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await db.orm.public.User.where({ id: payload.userId }).first();
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
