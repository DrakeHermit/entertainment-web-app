import { TrendingItem } from "./types/types";

export function getTitle(item: TrendingItem): string {
  return item.media_type === "movie" ? item.title : item.name;
}

export function getReleaseYear(item: TrendingItem): number {
  const date = item.media_type === "movie" ? item.release_date : item.first_air_date;
  return date ? new Date(date).getFullYear() : 0;
}

export function isValidResult(item: TrendingItem): boolean {
  const title = getTitle(item);
  const year = getReleaseYear(item);
  return !!(
    item.backdrop_path &&
    title.length > 3 &&
    year > 0
  );
}
