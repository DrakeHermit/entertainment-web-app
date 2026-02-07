"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface BookmarkContextType {
  isBookmarked: (id: number, category: "Movie" | "TV Series") => boolean;
  addBookmarkToContext: (id: number, category: "Movie" | "TV Series") => void;
  removeBookmarkFromContext: (id: number, category: "Movie" | "TV Series") => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

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
    new Set(initialMovies)
  );
  const [bookmarkedSeries, setBookmarkedSeries] = useState<Set<number>>(
    new Set(initialSeries)
  );

  const isBookmarked = useCallback((id: number, category: "Movie" | "TV Series") => {
    if (category === "Movie") {
      return bookmarkedMovies.has(id);
    } else {
      return bookmarkedSeries.has(id);
    }
  }, [bookmarkedMovies, bookmarkedSeries]);

  const addBookmarkToContext = useCallback((id: number, category: "Movie" | "TV Series") => {
    if (category === "Movie") {
      setBookmarkedMovies(prev => new Set(prev).add(id));
    } else {
      setBookmarkedSeries(prev => new Set(prev).add(id));
    }
  }, []);

  const removeBookmarkFromContext = useCallback((id: number, category: "Movie" | "TV Series") => {
    if (category === "Movie") {
      setBookmarkedMovies(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      setBookmarkedSeries(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, []);

  return (
    <BookmarkContext.Provider
      value={{
        isBookmarked,
        addBookmarkToContext,
        removeBookmarkFromContext,
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
