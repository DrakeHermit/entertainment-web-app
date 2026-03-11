"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const DetailsBackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="mb-300 md:mb-400 mt-300">
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors border border-white rounded-full px-4 py-2 cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
    </div>
  );
};
export default DetailsBackButton;
