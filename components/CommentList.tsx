"use client";

import { MessageCircle } from "lucide-react";
import { useComments } from "@/contexts/CommentContext";
import { CommentData } from "@/lib/types/types";
import Comment from "./Comment";

function countAll(comments: CommentData[]): number {
  return comments.reduce((sum, c) => sum + 1 + countAll(c.replies), 0);
}

const CommentList = () => {
  const { comments } = useComments();

  const totalCount = countAll(comments);

  return (
    <div className="flex justify-center mt-600">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-white" />
          <h2 className="text-xl font-semibold text-white">
            Comments
            {totalCount > 0 && (
              <span className="text-white/50 ml-2 text-base font-normal">
                ({totalCount})
              </span>
            )}
          </h2>
        </div>

        {comments.length === 0 ? (
          <p className="text-white/50 text-sm text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
