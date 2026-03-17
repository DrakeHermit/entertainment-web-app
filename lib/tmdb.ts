import { TrendingItem, Movie, TVSeries, TrendingResponse, MovieResponse, TVSeriesResponse, MovieDetails, TVSeriesDetails } from "./types/types";
import { isValidResult } from "./helpers";

const PAGES_TO_FETCH = 4;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
  },
};

const fetchOptions = { ...options, next: { revalidate: 60 * 60 * 24 } };

async function fetchPages<T>(
  baseUrl: string,
  pages: number = PAGES_TO_FETCH
): Promise<T[]> {
  const separator = baseUrl.includes("?") ? "&" : "?";
  const requests = Array.from({ length: pages }, (_, i) =>
    fetch(`${baseUrl}${separator}page=${i + 1}`, fetchOptions)
  );
  const responses = await Promise.all(requests);
  const results: T[] = [];
  for (const response of responses) {
    if (!response.ok) continue;
    const data = await response.json();
    results.push(...(data.results ?? []));
  }
  return results;
}

export const getTrendingAll = async (): Promise<TrendingItem[]> => {
  const results = await fetchPages<TrendingItem>(
    "https://api.themoviedb.org/3/trending/all/week"
  );
  return results.filter(isValidResult);
};

export const getPopularMovies = async (): Promise<Movie[]> => {
  const results = await fetchPages<Omit<Movie, "media_type">>(
    "https://api.themoviedb.org/3/movie/popular"
  );
  return results
    .map((movie) => ({ ...movie, media_type: "movie" as const }))
    .filter(isValidResult);
};

export const getPopularTVSeries = async (): Promise<TVSeries[]> => {
  const results = await fetchPages<Omit<TVSeries, "media_type">>(
    "https://api.themoviedb.org/3/tv/popular"
  );
  return results
    .map((tv) => ({ ...tv, media_type: "tv" as const }))
    .filter(isValidResult);
};

function interleave<A, B>(a: A[], b: B[]): (A | B)[] {
  const result: (A | B)[] = [];
  const maxLength = Math.max(a.length, b.length);
  for (let i = 0; i < maxLength; i++) {
    if (a[i]) result.push(a[i]);
    if (b[i]) result.push(b[i]);
  }
  return result;
}

export const getPopularAll = async (): Promise<TrendingItem[]> => {
  const [movies, tvSeries] = await Promise.all([
    getPopularMovies(),
    getPopularTVSeries(),
  ]);
  return interleave(movies, tvSeries);
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
  const results = await fetchPages<Omit<Movie, "media_type">>(
    "https://api.themoviedb.org/3/movie/top_rated"
  );
  return results
    .map((movie) => ({ ...movie, media_type: "movie" as const }))
    .filter(isValidResult);
};

export const getTopRatedTVSeries = async (): Promise<TVSeries[]> => {
  const results = await fetchPages<Omit<TVSeries, "media_type">>(
    "https://api.themoviedb.org/3/tv/top_rated"
  );
  return results
    .map((tv) => ({ ...tv, media_type: "tv" as const }))
    .filter(isValidResult);
};

export const getTopRatedAll = async (): Promise<TrendingItem[]> => {
  const [movies, tvSeries] = await Promise.all([
    getTopRatedMovies(),
    getTopRatedTVSeries(),
  ]);
  return interleave(movies, tvSeries);
};

export const searchMulti = async (query: string): Promise<TrendingItem[]> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}`,
    options
  );
  if (!response.ok) return [];
  const data: TrendingResponse = await response.json();
  return (data.results ?? [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .filter(isValidResult);
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
    options
  );
  if (!response.ok) return [];
  const data: MovieResponse = await response.json();
  return (data.results ?? [])
    .map((movie) => ({ ...movie, media_type: "movie" as const }))
    .filter(isValidResult);
};

export const searchTVSeries = async (query: string): Promise<TVSeries[]> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}`,
    options
  );
  if (!response.ok) return [];
  const data: TVSeriesResponse = await response.json();
  return (data.results ?? [])
    .map((tv) => ({ ...tv, media_type: "tv" as const }))
    .filter(isValidResult);
};

export const getMovieDetails = async (id: number): Promise<MovieDetails | null> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}`,
    { ...options, next: { revalidate: 60 * 60 * 24 } }
  );
  if (!response.ok) return null;
  return response.json();
};

export const getTVSeriesDetails = async (id: number): Promise<TVSeriesDetails | null> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}`,
    { ...options, next: { revalidate: 60 * 60 * 24 } }
  );
  if (!response.ok) return null;
  return response.json();
};