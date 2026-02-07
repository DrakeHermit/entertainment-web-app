'use server';

import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { bookmarkedMovies, bookmarkedTvSeries, movies, tvSeries } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function removeBookmark(
  userId: number,
  itemId: number,
  category: "Movie" | "TV Series"
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { error: "Unauthorized" };
  }

  try {
    if (category === "Movie") {
      const movie = await db
        .select()
        .from(movies)
        .where(eq(movies.tmdb_id, itemId))
        .limit(1);

      if (movie.length === 0) {
        return { error: "Movie not found" };
      }

      await db
        .delete(bookmarkedMovies)
        .where(
          and(
            eq(bookmarkedMovies.user_id, userId),
            eq(bookmarkedMovies.movie_id, movie[0].id)
          )
        );
    } else {
      const series = await db
        .select()
        .from(tvSeries)
        .where(eq(tvSeries.tmdb_id, itemId))
        .limit(1);

      if (series.length === 0) {
        return { error: "TV series not found" };
      }

      await db
        .delete(bookmarkedTvSeries)
        .where(
          and(
            eq(bookmarkedTvSeries.user_id, userId),
            eq(bookmarkedTvSeries.series_id, series[0].id)
          )
        );
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to remove bookmark" };
  }
}
