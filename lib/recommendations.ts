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
  let genreIds: number[] = [];

  try {
    const { bookmarkedMoviesData, bookmarkedSeriesData } = await getBookmarkGenres(userId);
    genreIds = [...new Set([
      ...bookmarkedMoviesData.flatMap((m) => m.genre_ids ?? []),
      ...bookmarkedSeriesData.flatMap((s) => s.genre_ids ?? []),
    ])];
  } catch (error) {
    console.error("Failed to fetch bookmark genres:", error);
  }

  if (genreIds.length === 0) {
    const fallbackResult = await getFallback(type);
    return fallbackResult;
  }

  try {
    if (type === "movie") {
      return await discoverMoviesByGenre(genreIds);
    } else if (type === "series") {
      return await discoverTVSeriesByGenre(genreIds);
    }

    const [movies, series] = await Promise.all([
      discoverMoviesByGenre(genreIds),
      discoverTVSeriesByGenre(genreIds),
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
