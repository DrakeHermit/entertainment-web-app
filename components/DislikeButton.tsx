"use client";

import { ThumbsDown } from "lucide-react";

interface DislikeButtonProps {
  count: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const DislikeButton = ({ count, isActive, onClick, disabled }: DislikeButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
    >
      <ThumbsDown
        className={`w-4 h-4 transition-colors ${
          isActive
            ? "text-red fill-red"
            : "text-white/50 group-hover:text-red"
        }`}
      />
      {count > 0 && (
        <span
          className={`transition-colors ${
            isActive ? "text-red" : "text-white/50"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default DislikeButton;
