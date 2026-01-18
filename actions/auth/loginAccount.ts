"use server";

import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type ActionState = {
  error: string | null;
  success?: boolean;
};

export async function loginAccount(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user[0]) {
    return { error: "User not found" };
  }

  const isPasswordValid = await bcrypt.compare(password, user[0].password);

  if (!isPasswordValid) {
    return { error: "Invalid password" };
  }

  console.log("User logged in:", email);
  redirect("/");
}