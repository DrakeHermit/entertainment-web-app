"use client";

import { CommentData } from "@/lib/types/types";
import { getDisplayName, getRelativeTime } from "@/lib/helpers";
import UserAvatar from "./UserAvatar";
import { SquarePen, Trash2, Check, X, Reply } from "lucide-react";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import { deleteComment } from "@/actions/comments/deleteComment";
import { postComment } from "@/actions/comments/postComment";
import { useComments } from "@/contexts/CommentContext";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useEditComment } from "@/lib/hooks/useEditComment";
import { toggleReaction } from "@/actions/comments/toggleReaction";
import { useState, useRef } from "react";

const Comment = ({
  comment,
  isReply = false,
}: {
  comment: CommentData;
  isReply?: boolean;
}) => {
  const displayName = getDisplayName(comment.user.username, comment.user.email);
  const { dispatch, userId, movieId, seriesId, metadata } = useComments();
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

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isPostingReply, setIsPostingReply] = useState(false);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleLikeComment = async (commentId: number) => {
    const result = await toggleReaction(userId, commentId, "like", type);
    if (result.success) {
      dispatch({
        type: "TOGGLE_REACTION",
        payload: { id: commentId, reaction: "like" },
      });
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  const handleDislikeComment = async (commentId: number) => {
    const result = await toggleReaction(userId, commentId, "dislike", type);
    if (result.success) {
      dispatch({
        type: "TOGGLE_REACTION",
        payload: { id: commentId, reaction: "dislike" },
      });
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setIsPostingReply(true);
    const result = await postComment(userId, {
      movieId: movieId || null,
      seriesId: seriesId || null,
      content: replyContent,
      metadata,
      parentId: comment.id,
    });

    if (result.success && result.comment) {
      dispatch({
        type: "ADD_REPLY",
        payload: { parentId: comment.id, reply: result.comment },
      });
      setReplyContent("");
      setIsReplying(false);
    } else {
      toast.error(result.error || "Something went wrong");
    }
    setIsPostingReply(false);
  };

  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
    if (e.key === "Escape") {
      setIsReplying(false);
      setReplyContent("");
    }
  };

  return (
    <div>
      <div className={`flex gap-3 bg-semi-dark-blue p-4 rounded-lg ${isReply ? "ml-8 mt-2" : ""}`}>
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
                  onClick={() => handleLikeComment(comment.id)}
                />
                <DislikeButton
                  count={comment.dislike_count}
                  isActive={comment.user_reaction === "dislike"}
                  onClick={() => handleDislikeComment(comment.id)}
                />
                {!isReply && (
                  <button
                    onClick={() => {
                      setIsReplying(!isReplying);
                      setTimeout(() => replyTextareaRef.current?.focus(), 0);
                    }}
                    className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Reply
                  </button>
                )}
              </div>
            </>
          )}

          {isReplying && (
            <div className="flex flex-col gap-2 mt-3">
              <textarea
                ref={replyTextareaRef}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={handleReplyKeyDown}
                disabled={isPostingReply}
                rows={2}
                placeholder="Write a reply..."
                className="w-full bg-dark-blue text-white text-sm rounded-md p-3 border border-white/20 focus:border-red focus:outline-none resize-none transition-colors disabled:opacity-50 placeholder-white/50"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent("");
                  }}
                  disabled={isPostingReply}
                  className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={isPostingReply || !replyContent.trim()}
                  className="flex items-center gap-1.5 bg-red hover:bg-red/80 text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                >
                  <Reply className="w-3.5 h-3.5" />
                  {isPostingReply ? "Posting..." : "Reply"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isReply && comment.replies.length > 0 && (
        <div className="flex flex-col gap-2">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
