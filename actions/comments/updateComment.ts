'use server';

import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { movieComments, tvSeriesComments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function updateComment(
  userId: number,
  commentId: number,
  content: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { error: "Unauthorized" };
  }

  const movieComment = await db.select().from(movieComments).where(eq(movieComments.id, commentId)).limit(1);
  const tvSeriesComment = await db.select().from(tvSeriesComments).where(eq(tvSeriesComments.id, commentId)).limit(1);
  if (movieComment.length === 0 && tvSeriesComment.length === 0) {
    return { error: "Comment not found" };
  }
  if (movieComment.length > 0 && movieComment[0].user_id !== userId) {
    return { error: "Unauthorized" };
  }
  
  try {
    if (movieComment.length > 0) {
      await db.update(movieComments).set({ content: content }).where(eq(movieComments.id, commentId));
    }
    if (tvSeriesComment.length > 0) {
      await db.update(tvSeriesComments).set({ content: content }).where(eq(tvSeriesComments.id, commentId));
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update comment" };
  }
}