import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addBookmark } from "@/actions/post/addBookmark";
import { removeBookmark } from "@/actions/post/removeBookmark";
import { useBookmarks } from "@/contexts/BookmarkContext";

interface UseBookmarkToggleProps {
  id: number;
  title: string;
  year: number;
  category: "Movie" | "TV Series";
  rating: string;
  thumbnail?: string;
  userId?: number;
}

export function useBookmarkToggle({
  id,
  title,
  year,
  category,
  rating,
  thumbnail,
  userId,
}: UseBookmarkToggleProps) {
  const { isBookmarked } = useBookmarks();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const bookmarked = isBookmarked(id, category);

  const toggleBookmark = async () => {
    if (!userId || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      if (bookmarked) {
        const result = await removeBookmark(userId, id, category);
        if (result.error) {
          console.error("Failed to remove bookmark:", result.error);
        }
      } else {
        const result = await addBookmark(userId, {
          id,
          title,
          year,
          category,
          rating,
          thumbnail,
        });
        if (result.error) {
          console.error("Failed to add bookmark:", result.error);
        }
      }

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bookmarked,
    isLoading: isLoading || isPending,
    toggleBookmark,
  };
}
