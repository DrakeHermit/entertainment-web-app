import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { addBookmark } from "@/actions/bookmarks/addBookmark";
import { removeBookmark } from "@/actions/bookmarks/removeBookmark";
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
  const { isBookmarked, updateOptimisticBookmark } = useBookmarks();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const bookmarked = isBookmarked(id, category);

  const toggleBookmark = () => {
    if (!userId || isPending) {
      return;
    }

    startTransition(async () => {
      updateOptimisticBookmark(id, category, bookmarked ? "remove" : "add");

      if (bookmarked) {
        const result = await removeBookmark(userId, id, category);
        if (result.error) {
          console.error("Failed to remove bookmark:", result.error);
          return;
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
          return;
        }
      }

      router.refresh();
    });
  };

  return {
    bookmarked,
    isLoading: isPending,
    toggleBookmark,
  };
}
