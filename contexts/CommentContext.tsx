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
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === parentId
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment,
        ),
      };
    }
    case "UPDATE_COMMENT":
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === action.payload.id) {
            return { ...comment, content: action.payload.content };
          }
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === action.payload.id
                ? { ...reply, content: action.payload.content }
                : reply,
            ),
          };
        }),
      };
    case "DELETE_COMMENT":
      return {
        ...state,
        comments: state.comments
          .filter((comment) => comment.id !== action.payload)
          .map((comment) => ({
            ...comment,
            replies: comment.replies.filter(
              (reply) => reply.id !== action.payload,
            ),
          })),
      };
    case "TOGGLE_REACTION": {
      const { id, reaction } = action.payload;
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === id) return applyReaction(comment, reaction);
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === id ? applyReaction(reply, reaction) : reply,
            ),
          };
        }),
      };
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
