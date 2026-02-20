import { db } from "@/lib/db/drizzle";
import { movieComments, tvSeriesComments, movies, tvSeries, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { CommentData } from "@/lib/types/types";

export async function getComments(
  movieId?: number,
  seriesId?: number
): Promise<CommentData[]> {
  try {
    if (movieId) {
      const movie = await db
        .select({ id: movies.id })
        .from(movies)
        .where(eq(movies.tmdb_id, movieId))
        .limit(1);

      if (movie.length === 0) return [];

      const results = await db
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
        .where(eq(movieComments.movie_id, movie[0].id))
        .orderBy(desc(movieComments.created_at));

      return results;
    }

    if (seriesId) {
      const series = await db
        .select({ id: tvSeries.id })
        .from(tvSeries)
        .where(eq(tvSeries.tmdb_id, seriesId))
        .limit(1);

      if (series.length === 0) return [];

      const results = await db
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
        .where(eq(tvSeriesComments.series_id, series[0].id))
        .orderBy(desc(tvSeriesComments.created_at));

      return results;
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
