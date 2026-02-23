"use client";

import { useState, useRef, useEffect } from "react";
import { CommentData } from "@/lib/types/types";
import { getDisplayName, getRelativeTime } from "@/lib/helpers";
import UserAvatar from "./UserAvatar";
import { SquarePen, Trash2, Check, X } from "lucide-react";
import { deleteComment } from "@/actions/comments/deleteComment";
import { updateComment } from "@/actions/comments/updateComment";
import { useComments } from "@/contexts/CommentContext";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const Comment = ({ comment }: { comment: CommentData }) => {
  const displayName = getDisplayName(comment.user.username, comment.user.email);
  const { dispatch, userId } = useComments();
  const type = usePathname().split("/")[1] as "movie" | "tv";

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isOwner = userId === comment.user.id;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isEditing]);

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

  const handleEditComment = async () => {
    const trimmed = editContent.trim();
    if (!trimmed || trimmed === comment.content) {
      setIsEditing(false);
      setEditContent(comment.content);
      return;
    }

    setIsSaving(true);
    const result = await updateComment(userId, comment.id, trimmed);
    if (result.success) {
      dispatch({
        type: "UPDATE_COMMENT",
        payload: { id: comment.id, content: trimmed },
      });
      setIsEditing(false);
    } else {
      toast.error(result.error || "Failed to update comment");
    }
    setIsSaving(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
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
                onClick={() => setIsEditing(true)}
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleEditComment();
                }
                if (e.key === "Escape") handleCancelEdit();
              }}
              disabled={isSaving}
              rows={3}
              className="w-full bg-dark-blue text-white text-sm rounded-md p-3 border border-white/20 focus:border-red focus:outline-none resize-none transition-colors disabled:opacity-50"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                onClick={handleEditComment}
                disabled={isSaving || !editContent.trim()}
                className="flex items-center gap-1.5 bg-red hover:bg-red/80 text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white/80 text-sm leading-relaxed wrap-break-word">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default Comment;
