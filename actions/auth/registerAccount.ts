"use server";

import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import bcrypt from "bcrypt";

type ActionState = {
  error: string | null;
  success?: boolean;
};

export async function registerAccount(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      email,
      password: hashedPassword,
    });
    return { error: null, success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to register account" };
  }
}