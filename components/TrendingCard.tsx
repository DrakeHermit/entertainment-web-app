"use client";

import Link from "next/link";
import Image from "next/image";
import { Film, Tv } from "lucide-react";
import { IconBookmarkEmpty, IconBookmark } from "@/components/Icons";
import { useBookmarkToggle } from "@/lib/hooks/useBookmarkToggle";

interface TrendingCardProps {
  id: number;
  title: string;
  year: number;
  category: "Movie" | "TV Series";
  rating: string;
  thumbnail?: string;
  priority?: boolean;
  userId?: number;
}

const TrendingCard = ({
  id,
  title,
  year,
  category,
  rating,
  thumbnail,
  priority = false,
  userId,
}: TrendingCardProps) => {
  const { bookmarked, isLoading, toggleBookmark } = useBookmarkToggle({
    id,
    title,
    year,
    category,
    rating,
    thumbnail,
    userId,
  });

  const CategoryIcon = category === "Movie" ? Film : Tv;
  const href = category === "Movie" ? `/movie/${id}` : `/tv/${id}`;

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleBookmark();
  };

  return (
    <Link
      href={href}
      draggable={false}
      className="relative min-w-[240px] md:min-w-[470px] h-[140px] md:h-[230px] rounded-lg overflow-hidden group cursor-pointer mb-500 block"
    >
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 240px, 470px"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-900" />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

      <button
        className="absolute top-2 right-2 md:top-4 md:right-4 w-9 h-9 bg-background/50 rounded-full flex items-center justify-center hover:bg-white transition-colors group/btn z-10 cursor-pointer disabled:opacity-50"
        onClick={handleToggleBookmark}
        disabled={!userId || isLoading}
      >
        {bookmarked ? (
          <IconBookmark className="w-3 h-3.5 text-white group-hover/btn:text-black" />
        ) : (
          <IconBookmarkEmpty className="w-3 h-3.5 text-white group-hover/btn:text-black" />
        )}
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
    </Link>
  );
};

export default TrendingCard;
