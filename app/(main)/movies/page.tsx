import RecommendedSection from "@/components/RecommendedSection";
import RecommendedSectionSkeleton from "@/components/RecommendedSectionSkeleton";
import { getPopularMovies, searchMovies } from "@/lib/tmdb";
import { getPersonalizedRecommendations } from "@/lib/recommendations";
import { getUserId } from "@/lib/auth/checkSessionValid";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

async function MovieRecommendations({ userId }: { userId?: number }) {
  const recommended = userId
    ? await getPersonalizedRecommendations(userId, "movie")
    : await getPopularMovies();
  return <RecommendedSection recommended={recommended} userId={userId} />;
}

const MoviesPage = async ({ searchParams }: PageProps) => {
  const { q } = await searchParams;
  const userId = (await getUserId()) ?? undefined;

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

  return (
    <div>
      <h2 className="text-3xl font-medium text-white mb-300">
        {userId ? "Recommended Movies" : "Popular Movies"}
      </h2>
      <Suspense fallback={<RecommendedSectionSkeleton />}>
        <MovieRecommendations userId={userId} />
      </Suspense>
    </div>
  );
};

export default MoviesPage;
