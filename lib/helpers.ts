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

export function getDisplayName(username: string | null, email: string): string {
  if (username) return username;
  const local = email.split("@")[0];
  const dotIndex = local.indexOf(".");
  return dotIndex !== -1 ? local.slice(0, dotIndex) : local;
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
