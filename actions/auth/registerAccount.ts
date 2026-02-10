"use server";

import { genarateToken } from "@/lib/auth/genarateToken";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { ActionState } from "@/lib/types/types";

export async function registerAccount(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const avatarUrl = formData.get("avatarUrl") as string | null;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }
  
  const userExists = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (userExists[0]) {
    return { error: "User already exists", success: false };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await db.insert(users).values({
      email,
      username: username || null,
      password: hashedPassword,
      avatar_url: avatarUrl || null,
    }).returning();

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
    
    return { error: null, success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to register account" };
  }
}