import RecommendedSection from "@/components/RecommendedSection";
import { getPopularMovies } from "@/lib/tmdb";

const MoviesPage = async () => {
  const popular = await getPopularMovies();

  return (
    <div>
      <h2 className="text-3xl font-medium text-white mb-300">Popular Movies</h2>
      <RecommendedSection recommended={popular} />
    </div>
  );
};
export default MoviesPage;
