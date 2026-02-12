import Carousel from "@/components/Carousel";
import { getTopRatedAll, getPopularAll } from "@/lib/tmdb";
import RecommendedSection from "@/components/RecommendedSection";
import { Suspense } from "react";
import CarouselSkeleton from "@/components/CarouselSkeleton";
import RecommendedSectionSkeleton from "@/components/RecommendedSectionSkeleton";
import HomeContent from "@/components/HomeContent";
import { getUserId } from "@/lib/auth/checkSessionValid";

async function TopRatedCarousel({ userId }: { userId?: number }) {
  const topRated = await getTopRatedAll();
  return <Carousel trending={topRated} userId={userId} />;
}

async function RecommendedBlock({ userId }: { userId?: number }) {
  const popular = await getPopularAll();
  return <RecommendedSection recommended={popular} userId={userId} />;
}

export default async function Home() {
  const userId = (await getUserId()) ?? undefined;

  return (
    <HomeContent userId={userId}>
      <div>
        <h2 className="text-3xl font-medium text-white mb-300">
          All time top rated
        </h2>
        <Suspense fallback={<CarouselSkeleton />}>
          <TopRatedCarousel userId={userId} />
        </Suspense>
        <h2 className="text-3xl font-medium text-white mb-400">
          Recommended for you
        </h2>
        <Suspense fallback={<RecommendedSectionSkeleton />}>
          <RecommendedBlock userId={userId} />
        </Suspense>
      </div>
    </HomeContent>
  );
}
