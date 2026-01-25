interface MediaBase {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface Movie extends MediaBase {
  media_type: "movie";
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
}

export interface TVSeries extends MediaBase {
  media_type: "tv";
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

export type TrendingItem = Movie | TVSeries;

export interface TrendingResponse {
  page: number;
  results: TrendingItem[];
  total_pages: number;
  total_results: number;
}

export interface MovieResponse {
  page: number;
  results: Omit<Movie, "media_type">[];
  total_pages: number;
  total_results: number;
}

export interface TVSeriesResponse {
  page: number;
  results: Omit<TVSeries, "media_type">[];
  total_pages: number;
  total_results: number;
}