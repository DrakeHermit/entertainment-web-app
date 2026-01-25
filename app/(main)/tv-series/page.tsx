import RecommendedSection from "@/components/RecommendedSection";
import { getPopularTVSeries, searchTVSeries } from "@/lib/tmdb";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

const TvSeriesPage = async ({ searchParams }: PageProps) => {
  const { q } = await searchParams;

  if (q) {
    const searchResults = await searchTVSeries(q);
    return (
      <div>
        <h2 className="text-3xl font-medium text-white mb-400">
          Found {searchResults.length} TV series for &apos;{q}&apos;
        </h2>
        <RecommendedSection recommended={searchResults} />
      </div>
    );
  }

  const popular = await getPopularTVSeries();

  return (
    <div>
      <h2 className="text-3xl font-medium text-white mb-300">
        Popular TV Series
      </h2>
      <RecommendedSection recommended={popular} />
    </div>
  );
};

export default TvSeriesPage;
