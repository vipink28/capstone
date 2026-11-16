"use server";

import { requireAdmin } from "@/lib/session";
import { db } from "@/prisma/db";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function addSlider(
  prevState: { error?: string; message?: string },
  formData: FormData,
): Promise<{ error?: string; message?: string }> {
  await requireAdmin();

  const field = (name: string) => String(formData.get(name) ?? "").trim();
  const title = field("title");
  const description = field("description");
  const image = formData.get("image") as File;
  const cto = field("cto"); // call to action
  const order = field("order");
  const isActive = field("isActive");
  const endDate = field("endDate");

  // check if the cto is link or not
  if (
    title === null &&
    description === null &&
    order === null &&
    cto === null &&
    isActive === null &&
    endDate === null
  ) {
    return { error: "All fields are mandatory" };
  }

  const parsedDate = new Date(endDate);

  if (!image || image.size === 0) {
    return { error: "Image is required" };
  }

  // convert the image to a buffer
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 2. Create a unique filename to avoid overwriting existing files
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const fileExtension = path.extname(image.name);
  const filename = `${image.name.replace(fileExtension, "")}-${uniqueSuffix}${fileExtension}`;

  // 3. Define the local paths
  // The physical folder path on your server machine
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, filename);

  // The relative public URL path you will save to the database
  const dbRelativeUrl = `/uploads/${filename}`;

  // 4. Ensure the directory exists, then write the file
  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, buffer);

  await db.orm.public.SliderItem.create({
    title,
    description,
    cto,
    order: Number(order),
    isActive: isActive === "true",
    endDate: parsedDate.toISOString(),
    imageUrl: dbRelativeUrl,
  });

  return { message: "Slider added successfully" };
}
