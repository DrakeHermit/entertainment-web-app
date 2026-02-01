const RecommendedSectionSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-semi-dark-blue" />
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="h-3 w-8 bg-white/20 rounded" />
              <div className="h-3 w-10 bg-white/20 rounded" />
              <div className="h-3 w-14 bg-white/20 rounded" />
            </div>
            <div className="h-4 md:h-5 w-4/5 bg-white/30 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedSectionSkeleton;
