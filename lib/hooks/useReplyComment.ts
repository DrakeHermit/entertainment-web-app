import { useState, useRef, KeyboardEvent } from "react";
import { postComment } from "@/actions/comments/postComment";
import { useComments } from "@/contexts/CommentContext";
import { toast } from "sonner";

export function useReplyComment(parentId: number) {
  const { dispatch, userId, movieId, seriesId, metadata } = useComments();

  const [isOpen, setIsOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isPostingReply, setIsPostingReply] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const openReply = () => {
    setIsOpen(!isOpen);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const cancelReply = () => {
    setIsOpen(false);
    setReplyContent("");
  };

  const submitReply = async () => {
    if (!replyContent.trim()) return;

    setIsPostingReply(true);
    const result = await postComment(userId, {
      movieId: movieId || null,
      seriesId: seriesId || null,
      content: replyContent,
      metadata,
      parentId,
    });

    if (result.success && result.comment) {
      dispatch({
        type: "ADD_REPLY",
        payload: { parentId, reply: result.comment },
      });
      setReplyContent("");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Something went wrong");
    }
    setIsPostingReply(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitReply();
    }
    if (e.key === "Escape") cancelReply();
  };

  return {
    isOpen,
    replyContent,
    isPostingReply,
    textareaRef,
    setReplyContent,
    openReply,
    cancelReply,
    submitReply,
    handleKeyDown,
  };
}
