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
  if (!token?.value) {
    cookieStore.delete("token");
    redirect("/login");
  }
  try {
    const userId = await getUserId();
    if (userId) {
      await db.update(users).set({ jwt_token: null }).where(eq(users.id, userId));
    }
    cookieStore.delete("token");
  } catch (error) {
    console.error(error);
  }
  redirect('/')
}