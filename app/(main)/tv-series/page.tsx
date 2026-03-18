import RecommendedSection from "@/components/RecommendedSection";
import { getPopularTVSeries, searchTVSeries } from "@/lib/tmdb";
import { getPersonalizedRecommendations } from "@/lib/recommendations";
import { getUserId } from "@/lib/auth/checkSessionValid";
import { Suspense } from "react";
import RecommendedSectionSkeleton from "@/components/RecommendedSectionSkeleton";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

async function TVSeriesRecommendations({ userId }: { userId?: number }) {
  const recommended = userId
    ? await getPersonalizedRecommendations(userId, "series")
    : await getPopularTVSeries();
  return <RecommendedSection recommended={recommended} userId={userId} />;
}

const TvSeriesPage = async ({ searchParams }: PageProps) => {
  const { q } = await searchParams;
  const userId = (await getUserId()) ?? undefined;

  if (q) {
    const searchResults = await searchTVSeries(q);
    return (
      <div>
        <h2 className="text-3xl font-medium text-white mb-400">
          Found {searchResults.length} TV series for &apos;{q}&apos;
        </h2>
        <RecommendedSection recommended={searchResults} userId={userId} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-medium text-white mb-300">
        {userId ? "Recommended TV Series" : "Popular TV Series"}
      </h2>
      <Suspense fallback={<RecommendedSectionSkeleton />}>
        <TVSeriesRecommendations userId={userId} />
      </Suspense>
    </div>
  );
};

export default TvSeriesPage;
