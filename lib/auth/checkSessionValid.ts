import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";

function verifyToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

export async function checkSessionValid() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token?.value) return null;

  const decoded = verifyToken(token.value, env.JWT_SECRET);
  if (!decoded) return null;

  const { userId } = decoded as { userId: string };
  const user = await db
    .select({ jwt_token: users.jwt_token })
    .from(users)
    .where(eq(users.id, parseInt(userId)))
    .limit(1);

  if (!user[0] || user[0].jwt_token !== token.value) return null;
  return decoded;
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
  } catch {
    return null;
  }
}
