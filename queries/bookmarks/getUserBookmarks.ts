import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { bookmarkedMovies, bookmarkedTvSeries, movies, tvSeries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserBookmarks(userId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { movies: [], series: [] };
  }

  try {
    const bookmarkedMoviesData = await db
      .select({ tmdb_id: movies.tmdb_id })
      .from(bookmarkedMovies)
      .innerJoin(movies, eq(bookmarkedMovies.movie_id, movies.id))
      .where(eq(bookmarkedMovies.user_id, userId));

    const bookmarkedSeriesData = await db
      .select({ tmdb_id: tvSeries.tmdb_id })
      .from(bookmarkedTvSeries)
      .innerJoin(tvSeries, eq(bookmarkedTvSeries.series_id, tvSeries.id))
      .where(eq(bookmarkedTvSeries.user_id, userId));

    return {
      movies: bookmarkedMoviesData.map((m) => m.tmdb_id),
      series: bookmarkedSeriesData.map((s) => s.tmdb_id),
    };
  } catch (error) {
    console.error(error);
    return { movies: [], series: [] };
  }
}
