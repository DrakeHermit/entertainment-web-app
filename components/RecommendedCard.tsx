import Image from "next/image";
import { Film, Tv } from "lucide-react";
import bookmarkIcon from "@/assets/icon-bookmark-empty.svg";

interface RecommendedCardProps {
  title: string;
  year: number;
  category: "Movie" | "TV Series";
  rating: string;
  thumbnail?: string;
}

const RecommendedCard = ({
  title,
  year,
  category,
  rating,
  thumbnail,
}: RecommendedCardProps) => {
  const CategoryIcon = category === "Movie" ? Film : Tv;

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-900" />
        )}

        <button className="absolute top-6 right-6 w-8 h-8 bg-background/50 rounded-full flex items-center justify-center hover:bg-white transition-colors group/btn z-10 cursor-pointer">
          <Image
            src={bookmarkIcon}
            alt="Bookmark"
            width={12}
            height={14}
            className="group-hover/btn:brightness-0"
          />
        </button>

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="flex items-center gap-3 bg-white/25 pl-2 pr-6 py-2 rounded-full">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-10 border-l-background border-b-[6px] border-b-transparent ml-1" />
            </div>
            <span className="text-white font-medium">Play</span>
          </div>
        </div>
      </div>

      <div className="text-white">
        <div className="flex items-center gap-2 text-xs opacity-75 mb-1">
          <span>{year}</span>
          <span>•</span>
          <CategoryIcon className="w-3 h-3" />
          <span>{category}</span>
          <span>•</span>
          <span>{rating}</span>
        </div>
        <h3 className="text-sm md:text-lg font-medium">{title}</h3>
      </div>
    </div>
  );
};

export default RecommendedCard;
