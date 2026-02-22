"use client";

import { postComment } from "@/actions/comments/postComment";
import { useComments } from "@/contexts/CommentContext";
import { useActionState, useRef } from "react";

const CommentField = ({
  userId,
  movieId,
  seriesId,
}: {
  userId: number;
  movieId: number;
  seriesId: number;
}) => {
  const { dispatch } = useComments();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmitComment = async (
    _prevState: unknown,
    formData: FormData,
  ) => {
    const result = await postComment(userId, {
      movieId,
      seriesId,
      content: formData.get("content") as string,
    });

    if (result.success && result.comment) {
      dispatch({ type: "ADD_COMMENT", payload: result.comment });
      formRef.current?.reset();
    }

    return result;
  };

  const [state, formAction, isPending] = useActionState(
    handleSubmitComment,
    null,
  );

  return (
    <div className="flex justify-center mt-600">
      <form ref={formRef} action={formAction} className="w-full max-w-2xl">
        <textarea
          name="content"
          placeholder="Add a comment..."
          className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 focus:border-white focus:outline-none caret-red transition-colors"
        />
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={isPending}
            className="bg-red hover:bg-white hover:text-background text-white px-4 py-2 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Posting..." : "Add Comment"}
          </button>
        </div>
        {state?.error && <p className="text-red text-sm mt-2">{state.error}</p>}
      </form>
    </div>
  );
};

export default CommentField;
