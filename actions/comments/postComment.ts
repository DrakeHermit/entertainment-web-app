'use server';

import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { movieComments, tvSeriesComments, movies, tvSeries, users } from "@/lib/db/schema";
import { PostCommentProps, CommentData } from "@/lib/types/types";
import { eq, sql } from "drizzle-orm";

export async function postComment(
  userId: number,
  { movieId, seriesId, content, metadata }: PostCommentProps
): Promise<{ success?: boolean; error?: string; comment?: CommentData }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { error: "Unauthorized" };
  }

  try {
    if (movieId) {
      const [movie] = await db
        .insert(movies)
        .values({
          tmdb_id: metadata.tmdbId,
          title: metadata.title,
          backdrop_path: metadata.backdropPath,
          release_date: new Date(metadata.year, 0, 1),
          rating: parseFloat(metadata.rating),
        })
        .onConflictDoUpdate({
          target: movies.tmdb_id,
          set: { title: sql`excluded.title` },
        })
        .returning({ id: movies.id });

      const [inserted] = await db.insert(movieComments).values({
        user_id: userId,
        movie_id: movie.id,
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

      return { success: true, comment: { ...comment, parent_id: null, replies: [], like_count: 0, dislike_count: 0, user_reaction: null } };
    } else if (seriesId) {
      const [series] = await db
        .insert(tvSeries)
        .values({
          tmdb_id: metadata.tmdbId,
          name: metadata.title,
          backdrop_path: metadata.backdropPath,
          first_air_date: new Date(metadata.year, 0, 1),
          rating: parseFloat(metadata.rating),
        })
        .onConflictDoUpdate({
          target: tvSeries.tmdb_id,
          set: { name: sql`excluded.name` },
        })
        .returning({ id: tvSeries.id });

      const [inserted] = await db.insert(tvSeriesComments).values({
        user_id: userId,
        series_id: series.id,
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

      return { success: true, comment: { ...comment, parent_id: null, replies: [], like_count: 0, dislike_count: 0, user_reaction: null } };
    }

    return { error: "No movie or series specified" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to post comment" };
  }
}
