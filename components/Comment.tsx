"use client";

import { CommentData } from "@/lib/types/types";
import { getDisplayName, getRelativeTime } from "@/lib/helpers";
import UserAvatar from "./UserAvatar";
import { SquarePen, Trash2, Check, X, Reply, ChevronDown, ChevronUp } from "lucide-react";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import { deleteComment } from "@/actions/comments/deleteComment";
import { useComments } from "@/contexts/CommentContext";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useEditComment } from "@/lib/hooks/useEditComment";
import { useReplyComment } from "@/lib/hooks/useReplyComment";
import { toggleReaction } from "@/actions/comments/toggleReaction";
import { useState, RefObject } from "react";

const EditForm = ({
  textareaRef,
  editContent,
  setEditContent,
  handleKeyDown,
  isSaving,
  cancelEdit,
  saveEdit,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  editContent: string;
  setEditContent: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isSaving: boolean;
  cancelEdit: () => void;
  saveEdit: () => void;
}) => (
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
);

const ReplyFormBody = ({
  replyContent,
  isPostingReply,
  textareaRef,
  setReplyContent,
  cancelReply,
  submitReply,
  handleKeyDown,
}: {
  replyContent: string;
  isPostingReply: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  setReplyContent: (value: string) => void;
  cancelReply: () => void;
  submitReply: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) => (
  <div className="flex flex-col gap-2 mt-3 ml-8">
    <textarea
      ref={textareaRef}
      value={replyContent}
      onChange={(e) => setReplyContent(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={isPostingReply}
      rows={2}
      placeholder="Write a reply..."
      className="w-full bg-dark-blue text-white text-sm rounded-md p-3 border border-white/20 focus:border-red focus:outline-none resize-none transition-colors disabled:opacity-50 placeholder-white/50"
    />
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={cancelReply}
        disabled={isPostingReply}
        className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" />
        Cancel
      </button>
      <button
        onClick={submitReply}
        disabled={isPostingReply || !replyContent.trim()}
        className="flex items-center gap-1.5 bg-red hover:bg-red/80 text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
      >
        <Reply className="w-3.5 h-3.5" />
        {isPostingReply ? "Posting..." : "Reply"}
      </button>
    </div>
  </div>
);

const CommentReplies = ({ replies }: { replies: CommentData[] }) => {
  const [showReplies, setShowReplies] = useState(false);

  if (replies.length === 0) return null;

  return (
    <div className="mt-1 ml-8">
      <button
        onClick={() => setShowReplies(!showReplies)}
        className="flex items-center gap-1.5 text-red hover:text-red/80 text-xs font-semibold transition-colors cursor-pointer py-1"
      >
        {showReplies ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {showReplies ? "Hide" : "Show"} {replies.length} {replies.length === 1 ? "reply" : "replies"}
      </button>
      {showReplies && (
        <div className="flex flex-col gap-2">
          {replies.map((reply) => (
            <Comment key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );
};

const Comment = ({
  comment,
  isReply = false,
}: {
  comment: CommentData;
  isReply?: boolean;
}) => {
  const displayName = getDisplayName(comment.user.username, comment.user.email);
  const { dispatch, userId } = useComments();
  const type = usePathname().split("/")[1] as "movie" | "tv";

  const {
    isEditing,
    editContent,
    isSaving,
    textareaRef: editTextareaRef,
    setEditContent,
    startEditing,
    cancelEdit,
    saveEdit,
    handleKeyDown: handleEditKeyDown,
  } = useEditComment(comment.id, comment.content);

  const {
    isOpen: isReplyOpen,
    replyContent,
    isPostingReply,
    textareaRef: replyTextareaRef,
    setReplyContent,
    openReply,
    cancelReply,
    submitReply,
    handleKeyDown: handleReplyKeyDown,
  } = useReplyComment(comment.id);

  const isOwner = userId === comment.user.id;

  const handleDeleteComment = async () => {
    const result = await deleteComment(userId, comment.id, type);
    if (result.success) {
      dispatch({ type: "DELETE_COMMENT", payload: comment.id });
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  const handleLikeComment = async () => {
    const result = await toggleReaction(userId, comment.id, "like", type);
    if (result.success) {
      dispatch({
        type: "TOGGLE_REACTION",
        payload: { id: comment.id, reaction: "like" },
      });
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  const handleDislikeComment = async () => {
    const result = await toggleReaction(userId, comment.id, "dislike", type);
    if (result.success) {
      dispatch({
        type: "TOGGLE_REACTION",
        payload: { id: comment.id, reaction: "dislike" },
      });
    } else {
      toast.error(result.error || "Something went wrong");
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
                  onClick={handleDeleteComment}
                  className="w-4 h-4 text-white cursor-pointer hover:text-red transition-colors"
                />
              </div>
            )}
          </div>

          {isEditing ? (
            <EditForm
              textareaRef={editTextareaRef}
              editContent={editContent}
              setEditContent={setEditContent}
              handleKeyDown={handleEditKeyDown}
              isSaving={isSaving}
              cancelEdit={cancelEdit}
              saveEdit={saveEdit}
            />
          ) : (
            <>
              <p className="text-white/80 text-sm leading-relaxed wrap-break-word">
                {comment.content}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <LikeButton
                  count={comment.like_count}
                  isActive={comment.user_reaction === "like"}
                  onClick={handleLikeComment}
                />
                <DislikeButton
                  count={comment.dislike_count}
                  isActive={comment.user_reaction === "dislike"}
                  onClick={handleDislikeComment}
                />
                {!isReply && (
                  <button
                    onClick={openReply}
                    className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Reply
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {!isReply && isReplyOpen && (
        <ReplyFormBody
          replyContent={replyContent}
          isPostingReply={isPostingReply}
          textareaRef={replyTextareaRef}
          setReplyContent={setReplyContent}
          cancelReply={cancelReply}
          submitReply={submitReply}
          handleKeyDown={handleReplyKeyDown}
        />
      )}

      {!isReply && <CommentReplies replies={comment.replies} />}
    </div>
  );
};

export default Comment;
