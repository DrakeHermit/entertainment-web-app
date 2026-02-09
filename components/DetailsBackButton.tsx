"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const DetailsBackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="pb-8">
      <div className="my-300 md:my-400 lg:my-500">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors border border-white rounded-full px-4 py-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};
export default DetailsBackButton;
