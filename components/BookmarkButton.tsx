"use client";

import { IconBookmarkEmpty, IconBookmark } from "@/components/Icons";
import { useBookmarkToggle } from "@/lib/hooks/useBookmarkToggle";

interface BookmarkButtonProps {
  id: number;
  title: string;
  year: number;
  category: "Movie" | "TV Series";
  rating: string;
  thumbnail?: string;
  userId?: number;
  className?: string;
  genreIds?: number[];
}

export default function BookmarkButton({
  id,
  title,
  year,
  category,
  rating,
  thumbnail,
  userId,
  genreIds,
  className = "",
}: BookmarkButtonProps) {
  const { bookmarked, isLoading, toggleBookmark } = useBookmarkToggle({
    id,
    title,
    year,
    category,
    rating,
    thumbnail,
    userId,
    genreIds,
  });

  return (
    <button
      onClick={toggleBookmark}
      disabled={!userId || isLoading}
      className={`flex items-center gap-2 bg-semi-dark-blue hover:bg-white text-white hover:text-background px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
    >
      {bookmarked ? (
        <IconBookmark className="w-4 h-4" />
      ) : (
        <IconBookmarkEmpty className="w-4 h-4" />
      )}
      <span className="font-medium">
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </span>
    </button>
  );
}
