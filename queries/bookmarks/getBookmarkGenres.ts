import { bookmarkedMovies, bookmarkedTvSeries, movies, tvSeries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";

export async function getBookmarkGenres(userId: number) { 
  const bookmarkedMoviesData = await db
    .select({ genre_ids: movies.genreIds })
    .from(bookmarkedMovies)
    .innerJoin(movies, eq(bookmarkedMovies.movie_id, movies.id))
    .where(eq(bookmarkedMovies.user_id, userId));
  
  const bookmarkedSeriesData = await db
    .select({ genre_ids: tvSeries.genreIds })
    .from(bookmarkedTvSeries)
    .innerJoin(tvSeries, eq(bookmarkedTvSeries.series_id, tvSeries.id))
    .where(eq(bookmarkedTvSeries.user_id, userId));

  return {
    bookmarkedMoviesData: bookmarkedMoviesData,
    bookmarkedSeriesData: bookmarkedSeriesData,
  };
 }