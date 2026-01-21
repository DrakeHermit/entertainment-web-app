import SearchComponent from "@/components/SearchComponent";
import RecommendedCard from "@/components/RecommendedCard";
import Carousel from "@/components/Carousel";

export default function Home() {
  return (
    <div>
      <SearchComponent />
      <h2 className="text-3xl font-medium text-white mb-300">Trending</h2>
      <Carousel />
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
