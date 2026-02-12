"use client";

import {
  createContext,
  useContext,
  useOptimistic,
  useCallback,
  ReactNode,
} from "react";

type BookmarkUpdate = {
  id: number;
  type: "add" | "remove";
};

interface BookmarkContextType {
  isBookmarked: (id: number, category: "Movie" | "TV Series") => boolean;
  updateOptimisticBookmark: (
    id: number,
    category: "Movie" | "TV Series",
    type: "add" | "remove",
  ) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined,
);

export function BookmarkProvider({
  children,
  initialMovies,
  initialSeries,
}: {
  children: ReactNode;
  initialMovies: number[];
  initialSeries: number[];
}) {
  const [optimisticMovies, addOptimisticMovie] = useOptimistic(
    initialMovies,
    (currentMovies: number[], update: BookmarkUpdate) => {
      if (update.type === "add") {
        return [...currentMovies, update.id];
      }
      return currentMovies.filter((movieId) => movieId !== update.id);
    },
  );

  const [optimisticSeries, addOptimisticSeries] = useOptimistic(
    initialSeries,
    (currentSeries: number[], update: BookmarkUpdate) => {
      if (update.type === "add") {
        return [...currentSeries, update.id];
      }
      return currentSeries.filter((seriesId) => seriesId !== update.id);
    },
  );

  const isBookmarked = useCallback(
    (id: number, category: "Movie" | "TV Series") => {
      if (category === "Movie") {
        return optimisticMovies.includes(id);
      }
      return optimisticSeries.includes(id);
    },
    [optimisticMovies, optimisticSeries],
  );

  const updateOptimisticBookmark = useCallback(
    (id: number, category: "Movie" | "TV Series", type: "add" | "remove") => {
      const update: BookmarkUpdate = { id, type };
      if (category === "Movie") {
        addOptimisticMovie(update);
      } else {
        addOptimisticSeries(update);
      }
    },
    [addOptimisticMovie, addOptimisticSeries],
  );

  return (
    <BookmarkContext.Provider
      value={{
        isBookmarked,
        updateOptimisticBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
}
