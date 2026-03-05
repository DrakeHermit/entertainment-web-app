"use server";

import { generateToken } from "@/lib/auth/generateToken";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { ActionState } from "@/lib/types/types";
import { loginSchema, flattenFieldErrors } from "@/lib/validations/auth";

export async function loginAccount(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(raw);

  if (!result.success) {
    return {
      error: "Validation failed",
      fieldErrors: flattenFieldErrors(result.error),
    };
  }

  const { email, password } = result.data;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user[0]) {
    return { error: "Invalid email or password" };
  }

  const isPasswordValid = await bcrypt.compare(password, user[0].password);

  if (!isPasswordValid) {
    return { error: "Invalid email or password" };
  }

  const token = generateToken(user[0].id.toString());
  await db
    .update(users)
    .set({ jwt_token: token })
    .where(eq(users.id, user[0].id));
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: parseInt(process.env.JWT_EXPIRATION_TIME!),
    path: "/",
  });
  return { error: null, success: true };
}
