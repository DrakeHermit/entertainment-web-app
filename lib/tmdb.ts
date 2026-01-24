import { TrendingItem, Movie, TVSeries, TrendingResponse, MovieResponse, TVSeriesResponse } from "./types/types";

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
    options
  );
  const data: TrendingResponse = await response.json();
  return data.results;
};

export const getPopularMovies = async (): Promise<Movie[]> => {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/popular",
    options
  );
  const data: MovieResponse = await response.json();
  return data.results.map((movie) => ({ ...movie, media_type: "movie" as const }));
};

export const getPopularTVSeries = async (): Promise<TVSeries[]> => {
  const response = await fetch(
    "https://api.themoviedb.org/3/tv/popular",
    options
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
    options
  );
  const data: MovieResponse = await response.json();
  return data.results.map((movie) => ({ ...movie, media_type: "movie" as const }));
};

export const getTopRatedTVSeries = async (): Promise<TVSeries[]> => {
  const response = await fetch(
    "https://api.themoviedb.org/3/tv/top_rated",
    options
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