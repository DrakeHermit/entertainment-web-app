"use server";

import { users } from "@/lib/db/schema";
import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth/checkSessionValid";

export async function logoutAccount() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const refreshToken = cookieStore.get("refresh_token");
  if (!token?.value || !refreshToken?.value) {
    cookieStore.delete("token");
    cookieStore.delete("refresh_token");
    redirect("/login");
  }
  try {
    const userId = await getUserId();
    if (userId) {
      await db.update(users).set({ jwt_token: null, refresh_token: null }).where(eq(users.id, userId));
    }
    cookieStore.delete("token");
    cookieStore.delete("refresh_token");
  } catch (error) {
    console.error(error);
  }
  redirect('/')
}