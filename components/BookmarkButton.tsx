"use client";

import { useState } from "react";
import { IconBookmarkEmpty, IconBookmark } from "@/components/Icons";
import { addBookmark } from "@/actions/post/addBookmark";
import { removeBookmark } from "@/actions/post/removeBookmark";
import { useBookmarks } from "@/contexts/BookmarkContext";

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
  const { isBookmarked, addBookmarkToContext, removeBookmarkFromContext } = useBookmarks();
  const [isLoading, setIsLoading] = useState(false);
  const bookmarked = isBookmarked(id, category);

  const handleToggleBookmark = async () => {
    if (!userId || isLoading) {
      return;
    }

    setIsLoading(true);

    if (bookmarked) {
      removeBookmarkFromContext(id, category);
      const result = await removeBookmark(userId!, id, category);
      if (result.error) {
        addBookmarkToContext(id, category);
        console.error("Bookmark error:", result.error);
      }
    } else {
      addBookmarkToContext(id, category);
      const result = await addBookmark(userId!, {
        id,
        title,
        year,
        category,
        rating,
        thumbnail,
      });
      if (result.error) {
        removeBookmarkFromContext(id, category);
        console.error("Bookmark error:", result.error);
      }
    }

    setIsLoading(false);
  };

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={!userId || isLoading}
      className={`flex items-center gap-2 bg-semi-dark-blue hover:bg-white text-white hover:text-background px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {bookmarked ? (
        <IconBookmark className="w-4 h-4" />
      ) : (
        <IconBookmarkEmpty className="w-4 h-4" />
      )}
      <span className="font-medium">{bookmarked ? "Bookmarked" : "Bookmark"}</span>
    </button>
  );
}
