'use server';

import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { movieComments, tvSeriesComments, movies, tvSeries, users } from "@/lib/db/schema";
import { PostCommentProps, CommentData } from "@/lib/types/types";
import { eq } from "drizzle-orm";

export async function postComment(
  userId: number,
  { movieId, seriesId, content }: PostCommentProps
): Promise<{ success?: boolean; error?: string; comment?: CommentData }> {
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

      const [inserted] = await db.insert(movieComments).values({
        user_id: userId,
        movie_id: movie[0].id,
        content: content,
      }).returning();

      const [comment] = await db
        .select({
          id: movieComments.id,
          content: movieComments.content,
          created_at: movieComments.created_at,
          updated_at: movieComments.updated_at,
          user: {
            id: users.id,
            username: users.username,
            avatar_url: users.avatar_url,
            email: users.email,
          },
        })
        .from(movieComments)
        .innerJoin(users, eq(movieComments.user_id, users.id))
        .where(eq(movieComments.id, inserted.id));

      return { success: true, comment };
    } else if (seriesId) {
      const series = await db
        .select({ id: tvSeries.id })
        .from(tvSeries)
        .where(eq(tvSeries.tmdb_id, seriesId))
        .limit(1);

      if (series.length === 0) {
        return { error: "TV series not found" };
      }

      const [inserted] = await db.insert(tvSeriesComments).values({
        user_id: userId,
        series_id: series[0].id,
        content: content,
      }).returning();

      const [comment] = await db
        .select({
          id: tvSeriesComments.id,
          content: tvSeriesComments.content,
          created_at: tvSeriesComments.created_at,
          updated_at: tvSeriesComments.updated_at,
          user: {
            id: users.id,
            username: users.username,
            avatar_url: users.avatar_url,
            email: users.email,
          },
        })
        .from(tvSeriesComments)
        .innerJoin(users, eq(tvSeriesComments.user_id, users.id))
        .where(eq(tvSeriesComments.id, inserted.id));

      return { success: true, comment };
    }

    return { error: "No movie or series specified" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to post comment" };
  }
}