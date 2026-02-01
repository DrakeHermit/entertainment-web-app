import Carousel from "@/components/Carousel";
import { getTopRatedAll, getPopularAll } from "@/lib/tmdb";
import RecommendedSection from "@/components/RecommendedSection";
import { Suspense } from "react";
import CarouselSkeleton from "@/components/CarouselSkeleton";
import RecommendedSectionSkeleton from "@/components/RecommendedSectionSkeleton";
import HomeContent from "@/components/HomeContent";

async function TopRatedCarousel() {
  const topRated = await getTopRatedAll();
  return <Carousel trending={topRated} />;
}

async function RecommendedBlock() {
  const popular = await getPopularAll();
  return <RecommendedSection recommended={popular} />;
}

export default function Home() {
  return (
    <HomeContent>
      <div>
        <h2 className="text-3xl font-medium text-white mb-300">
          All time top rated
        </h2>
        <Suspense fallback={<CarouselSkeleton />}>
          <TopRatedCarousel />
        </Suspense>
        <h2 className="text-3xl font-medium text-white mb-400">
          Recommended for you
        </h2>
        <Suspense fallback={<RecommendedSectionSkeleton />}>
          <RecommendedBlock />
        </Suspense>
      </div>
    </HomeContent>
  );
}
