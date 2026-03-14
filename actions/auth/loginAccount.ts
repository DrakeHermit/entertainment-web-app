"use server";

import { generateRefreshToken, generateToken } from "@/lib/auth/generateToken";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { ActionState } from "@/lib/types/types";
import { loginSchema, flattenFieldErrors } from "@/lib/validations/auth";
import { env } from "@/lib/env";
import { checkRateLimit } from "@/lib/rateLimit";

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

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(`login:${ip}:${email}`);

  if (!allowed) {
    return {
      error: `Too many login attempts. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
    };
  }

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
  const refreshToken = generateRefreshToken(user[0].id.toString());
  await db
    .update(users)
    .set({ jwt_token: token, refresh_token: refreshToken })
    .where(eq(users.id, user[0].id));
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: env.JWT_EXPIRATION_TIME,
    path: "/",
  });
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: env.REFRESH_TOKEN_EXPIRATION_TIME,
    path: "/",
  });
  return { error: null, success: true };
}
