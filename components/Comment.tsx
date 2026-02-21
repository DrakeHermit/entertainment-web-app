"use client";

import { CommentData } from "@/lib/types/types";
import { getDisplayName, getRelativeTime } from "@/lib/helpers";
import UserAvatar from "./UserAvatar";

const Comment = ({ comment }: { comment: CommentData }) => {
  const displayName = getDisplayName(comment.user.username, comment.user.email);

  return (
    <div className="flex gap-3 bg-semi-dark-blue p-4 rounded-lg">
      <div className="shrink-0 pt-0.5">
        <UserAvatar user={comment.user} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-sm font-semibold truncate">
            {displayName}
          </span>
          <span className="text-white/50 text-xs shrink-0">
            {getRelativeTime(comment.created_at)}
          </span>
        </div>
        <p className="text-white/80 text-sm leading-relaxed wrap-break-word">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

export default Comment;
