"use server";

import { genarateToken } from "@/lib/auth/genarateToken";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ActionState } from "@/lib/types/types";

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
    return { error: "Invalid username or password" };
  }

  const isPasswordValid = await bcrypt.compare(password, user[0].password);

  if (!isPasswordValid) {
    return { error: "Invalid username or password" };
  }

  const token = genarateToken(user[0].id.toString());
  await db.update(users).set({ jwt_token: token }).where(eq(users.id, user[0].id));
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: parseInt(process.env.JWT_EXPIRATION_TIME!),
    path: "/",
  });

  console.log("User logged in:", email);
  redirect("/");
}