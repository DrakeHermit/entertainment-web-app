"use server";

import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserId } from "@/lib/auth/checkSessionValid";
import { env } from "@/lib/env";
import { ActionState } from "@/lib/types/types";

export async function updateAvatar(
  avatarUrl: string | null
): Promise<ActionState> {
  const userId = await getUserId();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  if (avatarUrl) {
    const validPrefix = `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/`;
    if (!avatarUrl.startsWith(validPrefix)) {
      return { error: "Invalid avatar URL" };
    }
  }

  try {
    await db
      .update(users)
      .set({
        avatar_url: avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { error: null, success: true };
  } catch {
    return { error: "Failed to update avatar" };
  }
}
