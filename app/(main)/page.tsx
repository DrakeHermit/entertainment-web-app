import Carousel from "@/components/Carousel";
import { getTopRatedAll, getPopularAll } from "@/lib/tmdb";
import RecommendedSection from "@/components/RecommendedSection";

export default async function Home() {
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
