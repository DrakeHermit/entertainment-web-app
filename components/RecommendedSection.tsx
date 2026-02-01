import { TrendingItem } from "@/lib/types/types";
import { getTitle, getReleaseYear } from "@/lib/helpers";
import RecommendedCard from "./RecommendedCard";

const RecommendedSection = ({ recommended }: { recommended: TrendingItem[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {recommended.map((item, index) => (
        <RecommendedCard
          key={item.id}
          id={item.id}
          title={getTitle(item)}
          year={getReleaseYear(item)}
          category={item.media_type === "movie" ? "Movie" : "TV Series"}
          rating={item.vote_average.toFixed(1)}
          thumbnail={
            item.backdrop_path
              ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
              : undefined
          }
          priority={false}
        />
      ))}
    </div>
  );
};

export default RecommendedSection;
