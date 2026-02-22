"use client";

import { CommentData } from "@/lib/types/types";
import { getDisplayName, getRelativeTime } from "@/lib/helpers";
import UserAvatar from "./UserAvatar";
import { SquarePen, Trash2 } from "lucide-react";
import { deleteComment } from "@/actions/comments/deleteComment";
import { useComments } from "@/contexts/CommentContext";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
const Comment = ({ comment }: { comment: CommentData }) => {
  const displayName = getDisplayName(comment.user.username, comment.user.email);
  const { dispatch, userId } = useComments();
  const type = usePathname().split("/")[1] as "movie" | "tv";
  const handleDeleteComment = async (
    commentId: number,
    type: "movie" | "tv",
  ) => {
    const result = await deleteComment(userId, commentId, type);
    if (result.success) {
      dispatch({ type: "DELETE_COMMENT", payload: commentId });
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };
  return (
    <div className="flex gap-3 bg-semi-dark-blue p-4 rounded-lg">
      <div className="shrink-0 pt-0.5">
        <UserAvatar user={comment.user} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-row justify-between items-center mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-sm font-semibold truncate">
              {displayName}
            </span>
            <span className="text-white/50 text-xs shrink-0">
              {getRelativeTime(comment.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <SquarePen className="w-4 h-4 text-white cursor-pointer hover:text-red transition-colors" />
            <Trash2
              onClick={() =>
                handleDeleteComment(comment.id, type as "movie" | "tv")
              }
              className="w-4 h-4 text-white cursor-pointer hover:text-red transition-colors"
            />
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed wrap-break-word">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

export default Comment;
