// app/actions/uploadLocalAction.ts
"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function uploadProfileLocal(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
      throw new Error("No file uploaded");
    }

    // 1. Convert the file to a Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Create a unique filename to avoid overwriting existing files
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.name);
    const filename = `${file.name.replace(fileExtension, "")}-${uniqueSuffix}${fileExtension}`;

    // 3. Define the local paths
    // The physical folder path on your server machine
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    // The relative public URL path you will save to the database
    const dbRelativeUrl = `/uploads/${filename}`;

    // 4. Ensure the directory exists, then write the file
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    // 5. Save the relative path string to your database
    await prisma.userProfile.create({
      data: {
        name: name,
        imageUrl: dbRelativeUrl, // e.g., "/uploads/my-photo-1700000000.jpg"
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Local upload error:", error);
    return { success: false, error: "Failed to save image locally." };
  }
}
