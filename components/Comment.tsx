"use client";

import { CommentData } from "@/lib/types/types";
import { getDisplayName, getRelativeTime } from "@/lib/helpers";
import UserAvatar from "./UserAvatar";
import { SquarePen, Trash2, Check, X } from "lucide-react";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import { deleteComment } from "@/actions/comments/deleteComment";
import { useComments } from "@/contexts/CommentContext";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useEditComment } from "@/lib/hooks/useEditComment";

const Comment = ({ comment }: { comment: CommentData }) => {
  const displayName = getDisplayName(comment.user.username, comment.user.email);
  const { dispatch, userId } = useComments();
  const type = usePathname().split("/")[1] as "movie" | "tv";

  const {
    isEditing,
    editContent,
    isSaving,
    textareaRef,
    setEditContent,
    startEditing,
    cancelEdit,
    saveEdit,
    handleKeyDown,
  } = useEditComment(comment.id, comment.content);

  const isOwner = userId === comment.user.id;

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
          {isOwner && !isEditing && (
            <div className="flex items-center gap-3">
              <SquarePen
                onClick={startEditing}
                className="w-4 h-4 text-white cursor-pointer hover:text-red transition-colors"
              />
              <Trash2
                onClick={() =>
                  handleDeleteComment(comment.id, type as "movie" | "tv")
                }
                className="w-4 h-4 text-white cursor-pointer hover:text-red transition-colors"
              />
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSaving}
              rows={3}
              className="w-full bg-dark-blue text-white text-sm rounded-md p-3 border border-white/20 focus:border-red focus:outline-none resize-none transition-colors disabled:opacity-50"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={cancelEdit}
                disabled={isSaving}
                className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={isSaving || !editContent.trim()}
                className="flex items-center gap-1.5 bg-red hover:bg-red/80 text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-white/80 text-sm leading-relaxed wrap-break-word">
              {comment.content}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <LikeButton
                count={comment.like_count}
                isActive={comment.user_reaction === "like"}
                onClick={() => {
                  console.log("like");
                }}
              />
              <DislikeButton
                count={comment.dislike_count}
                isActive={comment.user_reaction === "dislike"}
                onClick={() => {
                  console.log("dislike");
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
