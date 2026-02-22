'use server';

import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { movieComments, tvSeriesComments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function deleteComment(
  userId: number,
  commentId: number,
  type: "movie" | "tv"
): Promise<{ success?: boolean; error?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { error: "Unauthorized" };
  }

  if (type === "movie") {
    const movieComment = await db.select().from(movieComments).where(eq(movieComments.id, commentId)).limit(1);
    if (movieComment.length === 0) {
      return { error: "Comment not found" };
    }
    if (movieComment[0].user_id !== userId) {
      return { error: "Unauthorized" };
    }
    await db.delete(movieComments).where(eq(movieComments.id, commentId));
    return { success: true };
  }

  if (type === "tv") {
    const tvSeriesComment = await db.select().from(tvSeriesComments).where(eq(tvSeriesComments.id, commentId)).limit(1);
    if (tvSeriesComment.length === 0) {
      return { error: "Comment not found" };
    }
    if (tvSeriesComment[0].user_id !== userId) {
      return { error: "Unauthorized" };
    }
    await db.delete(tvSeriesComments).where(eq(tvSeriesComments.id, commentId));
    return { success: true };
  }
  return { error: "Invalid comment type" };
}