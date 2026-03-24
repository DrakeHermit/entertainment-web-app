import { getBookmarkGenres } from "@/queries/bookmarks/getBookmarkGenres";
import { discoverMoviesByGenre, discoverTVSeriesByGenre, getPopularAll, getPopularMovies, getPopularTVSeries } from "./tmdb";
import { TrendingItem } from "./types/types";

async function getFallback(type: "movie" | "series" | "all"): Promise<TrendingItem[]> {
  if (type === "movie") return getPopularMovies();
  if (type === "series") return getPopularTVSeries();
  return getPopularAll();
}

export async function getPersonalizedRecommendations(
  userId: number,
  type: "movie" | "series" | "all"
): Promise<TrendingItem[]> {
  let movieGenreIds: number[] = [];
  let seriesGenreIds: number[] = [];

  try {
    const { bookmarkedMoviesData, bookmarkedSeriesData } = await getBookmarkGenres(userId);
    movieGenreIds = [...new Set(bookmarkedMoviesData.flatMap((m) => m.genre_ids ?? []))];
    seriesGenreIds = [...new Set(bookmarkedSeriesData.flatMap((s) => s.genre_ids ?? []))];
  } catch (error) {
    console.error("Failed to fetch bookmark genres:", error);
  }

  try {
    if (type === "movie") {
      if (movieGenreIds.length === 0) return getFallback("movie");
      return await discoverMoviesByGenre(movieGenreIds);
    }

    if (type === "series") {
      if (seriesGenreIds.length === 0) return getFallback("series");
      return await discoverTVSeriesByGenre(seriesGenreIds);
    }

    const [movies, series] = await Promise.all([
      movieGenreIds.length > 0
        ? discoverMoviesByGenre(movieGenreIds)
        : getPopularMovies(),
      seriesGenreIds.length > 0
        ? discoverTVSeriesByGenre(seriesGenreIds)
        : getPopularTVSeries(),
    ]);

    const seen = new Set<number>();
    return [...movies, ...series].filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  } catch (error) {
    return getFallback(type);
  }
}
