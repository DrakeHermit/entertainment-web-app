import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { updateComment } from "@/actions/comments/updateComment";
import { useComments } from "@/contexts/CommentContext";
import { toast } from "sonner";

export function useEditComment(commentId: number, originalContent: string) {
  const { dispatch, userId } = useComments();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(originalContent);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isEditing]);

  const startEditing = () => setIsEditing(true);

  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent(originalContent);
  };

  const saveEdit = async () => {
    const trimmed = editContent.trim();
    if (!trimmed || trimmed === originalContent) {
      cancelEdit();
      return;
    }

    setIsSaving(true);
    const result = await updateComment(userId, commentId, trimmed);
    if (result.success) {
      dispatch({
        type: "UPDATE_COMMENT",
        payload: { id: commentId, content: trimmed },
      });
      setIsEditing(false);
    } else {
      toast.error(result.error || "Failed to update comment");
    }
    setIsSaving(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === "Escape") cancelEdit();
  };

  return {
    isEditing,
    editContent,
    isSaving,
    textareaRef,
    setEditContent,
    startEditing,
    cancelEdit,
    saveEdit,
    handleKeyDown,
  };
}
