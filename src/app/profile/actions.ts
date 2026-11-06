"use server";

import { requireAuth } from "@/lib/session";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { error } from "console";

type FormState = { error?: string; message?: string };

export async function updateProfile(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAuth();
  const name = formData.get("name") as string;

  if (name.length < 2 || name.length > 80) {
    return { error: "Name must be between 2 and 80 characters" };
  }

  await db.orm.public.User.where({ id: user.id }).update({ name });
  revalidatePath("/", "layout");
  return { message: "Profile Updated" };
}

export async function changePassword(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAuth();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    return { error: "New password must be atleast 8 characters" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "The new passwords do not match" };
  }

  const matches = await bcrypt.compare(currentPassword, user.password);
  if (!matches) {
    return { error: "Current password is incorrect" };
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.orm.public.User.where({ id: user.id }).update({ password: hashed });

  return { message: "Password Changed" };
}

export async function deleteAddress(addressId: number) {
  const user = await requireAuth();
  await db.orm.public.Address.where({
    id: addressId,
    userId: user.id,
  }).delete();
  revalidatePath("/profile");
  revalidatePath("/checkout");
}
