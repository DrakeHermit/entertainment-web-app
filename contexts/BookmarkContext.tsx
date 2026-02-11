"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

interface BookmarkContextType {
  isBookmarked: (id: number, category: "Movie" | "TV Series") => boolean;
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
  const [bookmarkedMovies, setBookmarkedMovies] = useState<Set<number>>(
    new Set(initialMovies),
  );
  const [bookmarkedSeries, setBookmarkedSeries] = useState<Set<number>>(
    new Set(initialSeries),
  );

  useEffect(() => {
    setBookmarkedMovies(new Set(initialMovies));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialMovies)]);

  useEffect(() => {
    setBookmarkedSeries(new Set(initialSeries));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialSeries)]);

  const isBookmarked = useCallback(
    (id: number, category: "Movie" | "TV Series") => {
      if (category === "Movie") {
        return bookmarkedMovies.has(id);
      } else {
        return bookmarkedSeries.has(id);
      }
    },
    [bookmarkedMovies, bookmarkedSeries],
  );

  return (
    <BookmarkContext.Provider
      value={{
        isBookmarked,
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
