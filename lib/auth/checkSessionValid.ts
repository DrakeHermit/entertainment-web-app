import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function checkSessionValid() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token?.value) {
    return null;
  }
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_TOKEN!);
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserId(): Promise<number | null> {
  const decoded = await checkSessionValid();
  if (!decoded) {
    return null;
  }
  const { userId } = decoded as { userId: string };
  return parseInt(userId);
}

export async function getUserData() {
  const userId = await getUserId();
  if (!userId) {
    return null;
  }

  try {
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        avatar_url: users.avatar_url,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user[0] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}