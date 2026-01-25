import Carousel from "@/components/Carousel";
import { getTopRatedAll, getPopularAll, searchMulti } from "@/lib/tmdb";
import RecommendedSection from "@/components/RecommendedSection";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Home({ searchParams }: PageProps) {
  const { q } = await searchParams;

  if (q) {
    const searchResults = await searchMulti(q);
    return (
      <div>
        <h2 className="text-3xl font-medium text-white mb-400">
          Found {searchResults.length} results for &apos;{q}&apos;
        </h2>
        <RecommendedSection recommended={searchResults} />
      </div>
    );
  }

  const [topRated, popular] = await Promise.all([
    getTopRatedAll(),
    getPopularAll(),
  ]);

  return (
    <div>
      <h2 className="text-3xl font-medium text-white mb-300">
        All time top rated
      </h2>
      <Carousel trending={topRated} />
      <h2 className="text-3xl font-medium text-white mb-400">
        Recommended for you
      </h2>
      <RecommendedSection recommended={popular} />
    </div>
  );
}
