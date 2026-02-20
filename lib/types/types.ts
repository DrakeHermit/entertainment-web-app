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

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  budget: number;
  genres: Genre[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  status: string;
  tagline: string | null;
  title: string;
  vote_average: number;
  vote_count: number;
}

export interface TVSeriesDetails {
  adult: boolean;
  backdrop_path: string | null;
  created_by: { id: number; name: string }[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string | null;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  status: string;
  tagline: string | null;
  vote_average: number;
  vote_count: number;
}

export type ActionState = {
  error: string | null;
  success?: boolean;
};

export interface AddBookmarkProps {
  id: number;
  title: string;
  year: number;
  category: "Movie" | "TV Series";
  rating: string;
  thumbnail?: string;
}

export interface User {
  id: number;
  email: string;
  username: string | null;
  avatar_url: string | null;
}

export interface PostCommentProps {
  movieId: number | null;
  seriesId: number | null;
  content: string;
}

export interface CommentData {
  id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  user: {
    id: number;
    username: string | null;
    avatar_url: string | null;
    email: string;
  };
}