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
};

type CommentAction =
  | { type: "SET_COMMENTS"; payload: CommentData[] }
  | { type: "ADD_COMMENT"; payload: CommentData }
  | { type: "UPDATE_COMMENT"; payload: { id: number; content: string } }
  | { type: "DELETE_COMMENT"; payload: { id: number } };

function commentReducer(state: CommentState, action: CommentAction): CommentState {
  switch (action.type) {
    case "SET_COMMENTS":
      return { comments: action.payload };
    case "ADD_COMMENT":
      return { comments: [action.payload, ...state.comments] };
    case "UPDATE_COMMENT":
      return state;
    case "DELETE_COMMENT":
      return state;
    default:
      return state;
  }
}

interface CommentContextType {
  comments: CommentData[];
  dispatch: Dispatch<CommentAction>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({
  children,
  initialComments,
}: {
  children: ReactNode;
  initialComments: CommentData[];
}) {
  const [state, dispatch] = useReducer(commentReducer, {
    comments: initialComments,
  });

  return (
    <CommentContext.Provider value={{ comments: state.comments, dispatch }}>
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
