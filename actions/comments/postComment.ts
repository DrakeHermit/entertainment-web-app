'use server';

import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { movieComments, tvSeriesComments, movies, tvSeries } from "@/lib/db/schema";
import { PostCommentProps } from "@/lib/types/types";
import { eq } from "drizzle-orm";

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
      const movie = await db
        .select({ id: movies.id })
        .from(movies)
        .where(eq(movies.tmdb_id, movieId))
        .limit(1);

      if (movie.length === 0) {
        return { error: "Movie not found" };
      }

      await db.insert(movieComments).values({
        user_id: userId,
        movie_id: movie[0].id,
        content: content,
      });
    } else if (seriesId) {
      const series = await db
        .select({ id: tvSeries.id })
        .from(tvSeries)
        .where(eq(tvSeries.tmdb_id, seriesId))
        .limit(1);

      if (series.length === 0) {
        return { error: "TV series not found" };
      }

      await db.insert(tvSeriesComments).values({
        user_id: userId,
        series_id: series[0].id,
        content: content,
      });
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to post comment" };
  }
}