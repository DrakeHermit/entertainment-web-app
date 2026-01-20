import SearchComponent from "@/components/SearchComponent";
import TrendingCard from "@/components/TrendingCard";
import RecommendedCard from "@/components/RecommendedCard";

export default function Home() {
  return (
    <div>
      <SearchComponent />
      <h2 className="text-3xl font-medium text-white mb-300">Trending</h2>
      <TrendingCard
        title="The Dark Knight"
        year={2008}
        category="Movie"
        rating="8.5"
        thumbnail=""
      />
      <h2 className="text-3xl font-medium text-white mb-400">
        Recommended for you
      </h2>
      <RecommendedCard
        title="The Dark Knight"
        year={2008}
        category="Movie"
        rating="8.5"
        thumbnail=""
      />
    </div>
  );
}
