import { TrendingItem, getTitle, getReleaseYear } from "@/lib/types/types";
import RecommendedCard from "./RecommendedCard";

const RecommendedSection = ({ recommended }: { recommended: TrendingItem[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {recommended.map((item) => (
        <RecommendedCard
          key={item.id}
          title={getTitle(item)}
          year={getReleaseYear(item)}
          category={item.media_type === "movie" ? "Movie" : "TV Series"}
          rating={item.vote_average.toFixed(1)}
          thumbnail={
            item.backdrop_path
              ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
              : undefined
          }
        />
      ))}
    </div>
  );
};

export default RecommendedSection;
