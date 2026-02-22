"use client";

import {
  createContext,
  useContext,
  useReducer,
  Dispatch,
  ReactNode,
} from "react";
import { CommentData } from "@/lib/types/types";

type CommentState = {
  comments: CommentData[];
  userId: number;
};

type CommentAction =
  | { type: "SET_COMMENTS"; payload: CommentData[] }
  | { type: "ADD_COMMENT"; payload: CommentData }
  | { type: "UPDATE_COMMENT"; payload: { id: number; content: string } }
  | { type: "DELETE_COMMENT"; payload: number };

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
    case "UPDATE_COMMENT":
      return state;
    case "DELETE_COMMENT":
      return {
        comments: state.comments.filter(
          (comment) => comment.id !== action.payload,
        ),
        userId: state.userId,
      };
    default:
      return state;
  }
}

interface CommentContextType {
  comments: CommentData[];
  dispatch: Dispatch<CommentAction>;
  userId: number;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({
  children,
  initialComments,
  userId,
}: {
  children: ReactNode;
  initialComments: CommentData[];
  userId: number;
}) {
  const [state, dispatch] = useReducer(commentReducer, {
    comments: initialComments,
    userId,
  });

  return (
    <CommentContext.Provider
      value={{ comments: state.comments, dispatch, userId: state.userId }}
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
