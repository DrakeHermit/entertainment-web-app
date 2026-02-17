"use client";

import { useEffect } from "react";
import { useBookmarks } from "@/contexts/BookmarkContext";

export default function BookmarkSetter({
  movies,
  series,
}: {
  movies: number[];
  series: number[];
}) {
  const { hydrateBookmarks } = useBookmarks();

  useEffect(() => {
    hydrateBookmarks(movies, series);
  }, [movies, series, hydrateBookmarks]);

  return null;
}
