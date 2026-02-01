"use client";

import { useSearchParams } from "next/navigation";
import RecommendedSection from "@/components/RecommendedSection";
import RecommendedSectionSkeleton from "@/components/RecommendedSectionSkeleton";
import { useSearchResults } from "@/lib/hooks/useSearchResults";

export default function HomeContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const searchResults = useSearchResults(q);

  const hasQuery = q != null && q.trim() !== "";
  const isLoading = hasQuery && searchResults === null;

  return !hasQuery ? (
    <>{children}</>
  ) : isLoading ? (
    <div>
      <h2 className="text-3xl font-medium text-white mb-400">
        Searching for &apos;{q}&apos;...
      </h2>
      <RecommendedSectionSkeleton />
    </div>
  ) : (
    <div>
      <h2 className="text-3xl font-medium text-white mb-400">
        Found {searchResults!.length} results for &apos;{q}&apos;
      </h2>
      <RecommendedSection recommended={searchResults!} />
    </div>
  );
}
