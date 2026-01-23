import SearchComponent from "@/components/SearchComponent";
import Carousel from "@/components/Carousel";
import { getPopularAll, getTrendingAll } from "@/lib/tmdb";
import RecommendedSection from "@/components/RecommendedSection";

export default async function Home() {
  const [popular, recommended] = await Promise.all([
    getPopularAll(),
    getTrendingAll(),
  ]);

  return (
    <div>
      <SearchComponent />
      <h2 className="text-3xl font-medium text-white mb-300">Trending</h2>
      <Carousel trending={popular} />
      <h2 className="text-3xl font-medium text-white mb-400">
        Recommended for you
      </h2>
      <RecommendedSection recommended={recommended} />
    </div>
  );
}
