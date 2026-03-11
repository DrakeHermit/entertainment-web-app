"use client";

import {
  createContext,
  useContext,
  useReducer,
  Dispatch,
  ReactNode,
} from "react";
import { CommentData, MediaMetadata, ReactionType } from "@/lib/types/types";

type CommentState = {
  comments: CommentData[];
  userId: number;
};

type CommentAction =
  | { type: "SET_COMMENTS"; payload: CommentData[] }
  | { type: "ADD_COMMENT"; payload: CommentData }
  | { type: "ADD_REPLY"; payload: { parentId: number; reply: CommentData } }
  | { type: "UPDATE_COMMENT"; payload: { id: number; content: string } }
  | { type: "DELETE_COMMENT"; payload: number }
  | {
      type: "TOGGLE_REACTION";
      payload: { id: number; reaction: ReactionType };
    };

function applyReaction(comment: CommentData, reaction: ReactionType): CommentData {
  if (comment.user_reaction === reaction) {
    return {
      ...comment,
      user_reaction: null,
      like_count: comment.like_count - (reaction === "like" ? 1 : 0),
      dislike_count: comment.dislike_count - (reaction === "dislike" ? 1 : 0),
    };
  }

  const wasLike = comment.user_reaction === "like";
  const wasDislike = comment.user_reaction === "dislike";

  return {
    ...comment,
    user_reaction: reaction,
    like_count: comment.like_count + (reaction === "like" ? 1 : 0) - (wasLike ? 1 : 0),
    dislike_count: comment.dislike_count + (reaction === "dislike" ? 1 : 0) - (wasDislike ? 1 : 0),
  };
}

function addReplyDeep(comments: CommentData[], parentId: number, reply: CommentData): CommentData[] {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return { ...comment, replies: [...comment.replies, reply] };
    }
    return { ...comment, replies: addReplyDeep(comment.replies, parentId, reply) };
  });
}

function updateCommentDeep(comments: CommentData[], id: number, content: string): CommentData[] {
  return comments.map((comment) => {
    if (comment.id === id) {
      return { ...comment, content };
    }
    return { ...comment, replies: updateCommentDeep(comment.replies, id, content) };
  });
}

function deleteCommentDeep(comments: CommentData[], id: number): CommentData[] {
  return comments
    .filter((comment) => comment.id !== id)
    .map((comment) => ({
      ...comment,
      replies: deleteCommentDeep(comment.replies, id),
    }));
}

function toggleReactionDeep(comments: CommentData[], id: number, reaction: ReactionType): CommentData[] {
  return comments.map((comment) => {
    if (comment.id === id) return applyReaction(comment, reaction);
    return { ...comment, replies: toggleReactionDeep(comment.replies, id, reaction) };
  });
}

function commentReducer(
  state: CommentState,
  action: CommentAction,
): CommentState {
  switch (action.type) {
    case "SET_COMMENTS":
      return { comments: action.payload, userId: state.userId };
    case "ADD_COMMENT":
      return {
        comments: [action.payload, ...state.comments],
        userId: state.userId,
      };
    case "ADD_REPLY": {
      const { parentId, reply } = action.payload;
      return { ...state, comments: addReplyDeep(state.comments, parentId, reply) };
    }
    case "UPDATE_COMMENT":
      return { ...state, comments: updateCommentDeep(state.comments, action.payload.id, action.payload.content) };
    case "DELETE_COMMENT":
      return { ...state, comments: deleteCommentDeep(state.comments, action.payload) };
    case "TOGGLE_REACTION": {
      const { id, reaction } = action.payload;
      return { ...state, comments: toggleReactionDeep(state.comments, id, reaction) };
    }
    default:
      return state;
  }
}

interface CommentContextType {
  comments: CommentData[];
  dispatch: Dispatch<CommentAction>;
  userId: number;
  movieId: number;
  seriesId: number;
  metadata: MediaMetadata;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({
  children,
  initialComments,
  userId,
  movieId,
  seriesId,
  metadata,
}: {
  children: ReactNode;
  initialComments: CommentData[];
  userId: number;
  movieId: number;
  seriesId: number;
  metadata: MediaMetadata;
}) {
  const [state, dispatch] = useReducer(commentReducer, {
    comments: initialComments,
    userId,
  });

  return (
    <CommentContext.Provider
      value={{ comments: state.comments, dispatch, userId: state.userId, movieId, seriesId, metadata }}
    >
      {children}
    </CommentContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
}
