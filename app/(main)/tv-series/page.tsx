import RecommendedSection from "@/components/RecommendedSection";
import { getPopularTVSeries } from "@/lib/tmdb";

const TvSeriesPage = async () => {
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
