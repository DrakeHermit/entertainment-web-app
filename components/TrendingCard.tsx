import Image from "next/image";
import { Film, Tv } from "lucide-react";
import bookmarkIcon from "@/assets/icon-bookmark-empty.svg";

interface TrendingCardProps {
  title: string;
  year: number;
  category: "Movie" | "TV Series";
  rating: string;
  thumbnail?: string;
}

const TrendingCard = ({
  title,
  year,
  category,
  rating,
  thumbnail,
}: TrendingCardProps) => {
  const CategoryIcon = category === "Movie" ? Film : Tv;

  return (
    <div className="relative min-w-[240px] md:min-w-[470px] h-[140px] md:h-[230px] rounded-lg overflow-hidden group cursor-pointer mb-500">
      {thumbnail ? (
        <Image src={thumbnail} alt={title} fill className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-900" />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

      <button className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 bg-background/50 rounded-full flex items-center justify-center hover:bg-white transition-colors group/btn z-10 cursor-pointer">
        <Image
          src={bookmarkIcon}
          alt="Bookmark"
          width={12}
          height={14}
          className="group-hover/btn:brightness-0"
        />
      </button>

      <div className="absolute bottom-4 left-4 text-white z-10">
        <div className="flex items-center gap-2 text-xs md:text-sm opacity-75 mb-1">
          <span>{year}</span>
          <span>•</span>
          <CategoryIcon className="w-3 h-3" />
          <span>{category}</span>
          <span>•</span>
          <span>{rating}</span>
        </div>
        <h3 className="text-sm md:text-xl font-medium">{title}</h3>
      </div>

      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-5">
        <div className="flex items-center gap-3 bg-white/25 pl-2 pr-6 py-2 rounded-full">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-10 border-l-background border-b-[6px] border-b-transparent ml-1" />
          </div>
          <span className="text-white font-medium">Play</span>
        </div>
      </div>
    </div>
  );
};

export default TrendingCard;
