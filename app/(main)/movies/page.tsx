import RecommendedSection from "@/components/RecommendedSection";
import RecommendedSectionSkeleton from "@/components/RecommendedSectionSkeleton";
import { getPopularMovies, searchMovies } from "@/lib/tmdb";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

const MoviesPage = async ({ searchParams }: PageProps) => {
  const { q } = await searchParams;

  if (q) {
    const searchResults = await searchMovies(q);
    return (
      <div>
        <h2 className="text-3xl font-medium text-white mb-400">
          Found {searchResults.length} movies for &apos;{q}&apos;
        </h2>
        <RecommendedSection recommended={searchResults} />
      </div>
    );
  }

  const popular = await getPopularMovies();

  return (
    <div>
      <h2 className="text-3xl font-medium text-white mb-300">Popular Movies</h2>
      <Suspense fallback={<RecommendedSectionSkeleton />}>
        <RecommendedSection recommended={popular} />
      </Suspense>
    </div>
  );
};

export default MoviesPage;
