import { useEffect, useRef, useState } from "react";
import { TrendingItem } from "../types/types";

export function useSearchResults(query: string | null) {
  const [searchResults, setSearchResults] = useState<TrendingItem[] | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    
    (async () => {
      const hasQuery = query != null && query.trim() !== "";
      if (hasQuery) setSearchResults(null); 
      if (cancelledRef.current) return;

      const res = hasQuery
        ? await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        : null;
      const data = res ? await res.json() : null;

      if (cancelledRef.current) return;
      setSearchResults(data);
    })();

    return () => {
      cancelledRef.current = true;
    };
  }, [query]);

  return searchResults;
}