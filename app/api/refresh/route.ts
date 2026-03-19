import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { eq } from "drizzle-orm";
import { generateRefreshToken, generateToken } from "@/lib/auth/generateToken";
import { setAuthCookies } from "@/lib/auth/setAuthCookies";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const cookieRefreshToken = cookieStore.get("refresh_token");
  
  if (!cookieRefreshToken?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const decoded = jwt.verify(cookieRefreshToken.value, env.REFRESH_TOKEN_SECRET);
    const { userId } = decoded as { userId: string };
    const user = await db
      .select({ id: users.id, refresh_token: users.refresh_token })
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);
    if (!user[0] || user[0].refresh_token !== cookieRefreshToken.value) {
      cookieStore.delete("token");
      cookieStore.delete("refresh_token");
      await db.update(users).set({ jwt_token: null, refresh_token: null }).where(eq(users.id, parseInt(userId)));
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = generateToken(user[0].id.toString());
    const refreshToken = generateRefreshToken(user[0].id.toString());
    await db.update(users).set({ jwt_token: token, refresh_token: refreshToken }).where(eq(users.id, user[0].id));
    await setAuthCookies(token, refreshToken);
    return NextResponse.json({ error: null, success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}