'use server';

import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { bookmarkedMovies, bookmarkedTvSeries, movies, tvSeries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserBookmarksData(userId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { movies: [], series: [] };
  }
  
  try {
    const bookmarkedMoviesData = await db
      .select({
        id: movies.id,
        tmdb_id: movies.tmdb_id,
        title: movies.title,
        backdrop_path: movies.backdrop_path,
        release_date: movies.release_date,
        rating: movies.rating,
      })
      .from(bookmarkedMovies)
      .innerJoin(movies, eq(bookmarkedMovies.movie_id, movies.id))
      .where(eq(bookmarkedMovies.user_id, userId));

    const bookmarkedSeriesData = await db
      .select({
        id: tvSeries.id,
        tmdb_id: tvSeries.tmdb_id,
        name: tvSeries.name,
        backdrop_path: tvSeries.backdrop_path,
        first_air_date: tvSeries.first_air_date,
        rating: tvSeries.rating,
      })
      .from(bookmarkedTvSeries)
      .innerJoin(tvSeries, eq(bookmarkedTvSeries.series_id, tvSeries.id))
      .where(eq(bookmarkedTvSeries.user_id, userId));

    return {
      movies: bookmarkedMoviesData,
      series: bookmarkedSeriesData
    };
  } catch (error) {
    console.error('Error fetching user bookmarks data:', error);
    return { movies: [], series: [] };
  }
}