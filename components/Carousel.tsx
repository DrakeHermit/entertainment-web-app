"use client";

import TrendingCard from "./TrendingCard";
import { useCarousel } from "@/lib/hooks/useCarousel";
import { TrendingItem, getTitle, getReleaseYear } from "@/lib/types/types";

const Carousel = ({ trending }: { trending: TrendingItem[] }) => {
  const {
    containerRef,
    trackRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useCarousel();

  return (
    <div
      ref={containerRef}
      className="overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div ref={trackRef} className="flex gap-4 md:gap-500 w-max">
        {trending.map((item, index) => (
          <TrendingCard
            key={item.id}
            title={getTitle(item)}
            year={getReleaseYear(item)}
            category={item.media_type === "movie" ? "Movie" : "TV Series"}
            rating={Math.round(item.vote_average * 10) / 10 + ""}
            thumbnail={
              item.backdrop_path
                ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
                : undefined
            }
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
