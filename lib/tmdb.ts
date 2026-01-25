import { TrendingItem, Movie, TVSeries, TrendingResponse, MovieResponse, TVSeriesResponse } from "./types/types";
import { isValidResult } from "./helpers";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
  },
};

export const getTrendingAll = async (): Promise<TrendingItem[]> => {
  const response = await fetch(
    "https://api.themoviedb.org/3/trending/all/week",
    {...options,
     next: { revalidate: 60 * 60 * 24 } }
  );
  const data: TrendingResponse = await response.json();
  return data.results;
};

export const getPopularMovies = async (): Promise<Movie[]> => {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/popular",
    {...options,
     next: { revalidate: 60 * 60 * 24 } }
  );
  const data: MovieResponse = await response.json();
  return data.results.map((movie) => ({ ...movie, media_type: "movie" as const }));
};

export const getPopularTVSeries = async (): Promise<TVSeries[]> => {
  const response = await fetch(
    "https://api.themoviedb.org/3/tv/popular",
    {...options,
     next: { revalidate: 60 * 60 * 24 } }
  );
  const data: TVSeriesResponse = await response.json();
  return data.results.map((tv) => ({ ...tv, media_type: "tv" as const }));
};

export const getPopularAll = async (): Promise<TrendingItem[]> => {
  const [movies, tvSeries] = await Promise.all([
    getPopularMovies(),
    getPopularTVSeries(),
  ]);
  const result: TrendingItem[] = [];
  const maxLength = Math.max(movies.length, tvSeries.length);
  for (let i = 0; i < maxLength; i++) {
    if (movies[i]) result.push(movies[i]);
    if (tvSeries[i]) result.push(tvSeries[i]);
  }
  return result;
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated",
    {...options,
     next: { revalidate: 60 * 60 * 24 } }
  );
  const data: MovieResponse = await response.json();
  return data.results.map((movie) => ({ ...movie, media_type: "movie" as const }));
};

export const getTopRatedTVSeries = async (): Promise<TVSeries[]> => {
  const response = await fetch(
    "https://api.themoviedb.org/3/tv/top_rated",
    {...options,
     next: { revalidate: 60 * 60 * 24 } }
  );
  const data: TVSeriesResponse = await response.json();
  return data.results.map((tv) => ({ ...tv, media_type: "tv" as const }));
};

export const getTopRatedAll = async (): Promise<TrendingItem[]> => {
  const [movies, tvSeries] = await Promise.all([
    getTopRatedMovies(),
    getTopRatedTVSeries(),
  ]);
  const result: TrendingItem[] = [];
  const maxLength = Math.max(movies.length, tvSeries.length);
  for (let i = 0; i < maxLength; i++) {
    if (movies[i]) result.push(movies[i]);
    if (tvSeries[i]) result.push(tvSeries[i]);
  }
  return result;
};

export const searchMulti = async (query: string): Promise<TrendingItem[]> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}`,
    options
  );
  const data: TrendingResponse = await response.json();
  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .filter(isValidResult);
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
    options
  );
  const data: MovieResponse = await response.json();
  return data.results
    .map((movie) => ({ ...movie, media_type: "movie" as const }))
    .filter(isValidResult);
};

export const searchTVSeries = async (query: string): Promise<TVSeries[]> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}`,
    options
  );
  const data: TVSeriesResponse = await response.json();
  return data.results
    .map((tv) => ({ ...tv, media_type: "tv" as const }))
    .filter(isValidResult);
};