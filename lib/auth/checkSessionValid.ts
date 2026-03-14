import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";
import { generateRefreshToken, generateToken } from "./generateToken";

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

  if (token?.value) {
    const decoded = verifyToken(token.value, env.JWT_SECRET);
    if (decoded) {
      const { userId } = decoded as { userId: string };

      const user = await db
        .select({ jwt_token: users.jwt_token })
        .from(users)
        .where(eq(users.id, parseInt(userId)))
        .limit(1);

      if (user[0] && user[0].jwt_token === token.value) {
        return decoded;
      }
    }
  }

  const refreshToken = cookieStore.get("refresh_token");
  if (!refreshToken?.value) {
    return null;
  }

  try {
    const decoded = jwt.verify(refreshToken.value, env.REFRESH_TOKEN_SECRET);
    const { userId } = decoded as { userId: string };

    const user = await db
      .select({ id: users.id, refresh_token: users.refresh_token })
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (!user[0] || user[0].refresh_token !== refreshToken.value) {
      cookieStore.delete("token");
      cookieStore.delete("refresh_token");
      if (user[0]) {
        await db
          .update(users)
          .set({ jwt_token: null, refresh_token: null })
          .where(eq(users.id, user[0].id));
      }
      return null;
    }

    const newToken = generateToken(user[0].id.toString());
    const newRefreshToken = generateRefreshToken(user[0].id.toString());

    await db
      .update(users)
      .set({ jwt_token: newToken, refresh_token: newRefreshToken })
      .where(eq(users.id, user[0].id));

    cookieStore.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: env.JWT_EXPIRATION_TIME,
      path: "/",
    });
    cookieStore.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: env.REFRESH_TOKEN_EXPIRATION_TIME,
      path: "/",
    });

    return jwt.verify(newToken, env.JWT_SECRET);
  } catch {
    cookieStore.delete("token");
    cookieStore.delete("refresh_token");
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
  } catch {
    return null;
  }
}
