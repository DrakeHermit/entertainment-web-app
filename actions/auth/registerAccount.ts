"use server";

import { generateToken } from "@/lib/auth/generateToken";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { ActionState } from "@/lib/types/types";
import { registerSchema, flattenFieldErrors } from "@/lib/validations/auth";
import { env } from "@/lib/env";

export async function registerAccount(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = registerSchema.safeParse(raw);

  if (!result.success) {
    return {
      error: "Validation failed",
      fieldErrors: flattenFieldErrors(result.error),
    };
  }

  const { email, username, password } = result.data;
  const avatarUrl = formData.get("avatarUrl") as string | null;

  if (avatarUrl) {
    const validPrefix = `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/`;
    if (!avatarUrl.startsWith(validPrefix)) {
      return { error: "Invalid avatar URL" };
    }
  }

  const userExists = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (userExists[0]) {
    return { error: "Unable to create account with this email", success: false };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await db
      .insert(users)
      .values({
        email,
        username: username || null,
        password: hashedPassword,
        avatar_url: avatarUrl || null,
      })
      .returning();

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
      maxAge: env.JWT_EXPIRATION_TIME,
      path: "/",
    });

    return { error: null, success: true };
  } catch {
    return { error: "Failed to register account" };
  }
}
