"use client";

import TrendingCard from "./TrendingCard";
import { useCarousel } from "@/lib/hooks/useCarousel";

const Carousel = () => {
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
        <TrendingCard
          title="The Dark Knight"
          year={2008}
          category="Movie"
          rating="8.5"
          thumbnail=""
        />
        <TrendingCard
          title="Inception"
          year={2010}
          category="Movie"
          rating="8.8"
          thumbnail=""
        />
        <TrendingCard
          title="Breaking Bad"
          year={2008}
          category="TV Series"
          rating="9.5"
          thumbnail=""
        />
        <TrendingCard
          title="Interstellar"
          year={2014}
          category="Movie"
          rating="8.6"
          thumbnail=""
        />
        <TrendingCard
          title="The Office"
          year={2005}
          category="TV Series"
          rating="9.0"
          thumbnail=""
        />
      </div>
    </div>
  );
};

export default Carousel;
