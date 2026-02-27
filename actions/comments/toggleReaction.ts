'use server';

import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { movieCommentReactions, tvSeriesCommentReactions } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { ReactionType } from "@/lib/types/types";

export async function toggleReaction(
  userId: number,
  commentId: number,
  reaction: ReactionType,
  type: "movie" | "tv"
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { error: "Unauthorized" };
  }

  try {
    const table = type === "movie" ? movieCommentReactions : tvSeriesCommentReactions;

    const [existing] = await db
      .select()
      .from(table)
      .where(and(eq(table.user_id, userId), eq(table.comment_id, commentId)))
      .limit(1);

    if (existing?.reaction_type === reaction) {
      await db.delete(table).where(eq(table.id, existing.id));
    } else {
      await db
        .insert(table)
        .values({ user_id: userId, comment_id: commentId, reaction_type: reaction })
        .onConflictDoUpdate({
          target: [table.user_id, table.comment_id],
          set: { reaction_type: reaction },
        });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to toggle reaction" };
  }
}
