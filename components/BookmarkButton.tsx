"use client";

import { IconBookmarkEmpty } from "@/components/Icons";
import { addBookmark } from "@/actions/post/addBookmark";

interface BookmarkButtonProps {
  id: number;
  title: string;
  year: number;
  category: "Movie" | "TV Series";
  rating: string;
  thumbnail?: string;
  userId?: number;
  className?: string;
}

export default function BookmarkButton({
  id,
  title,
  year,
  category,
  rating,
  thumbnail,
  userId,
  className = "",
}: BookmarkButtonProps) {
  const handleAddBookmark = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }
    try {
      const result = await addBookmark(userId, {
        id,
        title,
        year,
        category,
        rating,
        thumbnail,
      });
      if (result?.error) {
        console.error("Bookmark error:", result.error);
      }
    } catch (error) {
      console.error("Failed to add bookmark:", error);
    }
  };

  return (
    <button
      onClick={handleAddBookmark}
      disabled={!userId}
      className={`flex items-center gap-2 bg-semi-dark-blue hover:bg-white text-white hover:text-background px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <IconBookmarkEmpty className="w-4 h-4" />
      <span className="font-medium">Bookmark</span>
    </button>
  );
}
