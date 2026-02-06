import RecommendedSection from "@/components/RecommendedSection";
import RecommendedSectionSkeleton from "@/components/RecommendedSectionSkeleton";
import { getPopularMovies, searchMovies } from "@/lib/tmdb";
import { getUserId } from "@/lib/server-helpers";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

const MoviesPage = async ({ searchParams }: PageProps) => {
  const { q } = await searchParams;
  const userIdData = await getUserId();
  const userId = userIdData && 'userId' in userIdData ? parseInt(userIdData.userId) : undefined;

  if (q) {
    const searchResults = await searchMovies(q);
    return (
      <div>
        <h2 className="text-3xl font-medium text-white mb-400">
          Found {searchResults.length} movies for &apos;{q}&apos;
        </h2>
        <RecommendedSection recommended={searchResults} userId={userId} />
      </div>
    );
  }

  const popular = await getPopularMovies();

  return (
    <div>
      <h2 className="text-3xl font-medium text-white mb-300">Popular Movies</h2>
      <Suspense fallback={<RecommendedSectionSkeleton />}>
        <RecommendedSection recommended={popular} userId={userId} />
      </Suspense>
    </div>
  );
};

export default MoviesPage;
