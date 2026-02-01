const CarouselSkeleton = () => {
  return (
    <div className="overflow-hidden select-none">
      <div className="flex gap-4 md:gap-500 w-max">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative min-w-[240px] md:min-w-[470px] h-[140px] md:h-[230px] rounded-lg overflow-hidden mb-500 bg-semi-dark-blue animate-pulse"
          >
            <div className="absolute top-2 right-2 md:top-4 md:right-4 w-9 h-9 rounded-full bg-white/10" />
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
              <div className="flex gap-2">
                <div className="h-3 w-8 bg-white/20 rounded" />
                <div className="h-3 w-12 bg-white/20 rounded" />
                <div className="h-3 w-16 bg-white/20 rounded" />
              </div>
              <div className="h-4 md:h-5 w-3/4 bg-white/30 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselSkeleton;
