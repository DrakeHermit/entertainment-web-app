import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
    if (!userId) {
      toast.error("Please log in to bookmark");
      return;
    }

    if (isPending) return;

    startTransition(async () => {
      updateOptimisticBookmark(id, category, bookmarked ? "remove" : "add");

      if (bookmarked) {
        const result = await removeBookmark(userId, id, category);
        if (result.error) {
          toast.error("Failed to remove bookmark");
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
          toast.error("Failed to add bookmark");
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
