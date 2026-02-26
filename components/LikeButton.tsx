"use client";

import { ThumbsUp } from "lucide-react";

interface LikeButtonProps {
  count: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const LikeButton = ({ count, isActive, onClick, disabled }: LikeButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
    >
      <ThumbsUp
        className={`w-4 h-4 transition-colors ${
          isActive
            ? "text-green-400 fill-green-400"
            : "text-white/50 group-hover:text-green-400"
        }`}
      />
      {count > 0 && (
        <span
          className={`transition-colors ${
            isActive ? "text-green-400" : "text-white/50"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default LikeButton;
