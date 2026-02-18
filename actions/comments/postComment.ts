'use server';

import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { movieComments, tvSeriesComments } from "@/lib/db/schema";
import { PostCommentProps } from "@/lib/types/types";

export async function postComment(
  userId: number,
  { movieId, seriesId, content }: PostCommentProps
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { error: "Unauthorized" };
  }

  try {
    if (movieId) {
      await db.insert(movieComments).values({
        user_id: userId,
        movie_id: movieId,
        content: content,
      });
    } else if (seriesId) {
      await db.insert(tvSeriesComments).values({
        user_id: userId,
        series_id: seriesId,
        content: content,
      });
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to post comment" };
  }
}