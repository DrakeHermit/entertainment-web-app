import { db } from "@/lib/db/drizzle";
import {
  movieComments,
  tvSeriesComments,
  movieCommentReactions,
  tvSeriesCommentReactions,
  movies,
  tvSeries,
  users,
} from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { CommentData, ReactionType } from "@/lib/types/types";

function includeReactions(
  comments: Omit<CommentData, "like_count" | "dislike_count" | "user_reaction" | "replies">[],
  reactions: { comment_id: number; user_id: number; reaction_type: string }[],
  userId?: number
): Omit<CommentData, "replies">[] {
  const countsByComment = new Map<number, { likes: number; dislikes: number; userReaction: ReactionType | null }>();

  for (const r of reactions) {
    const entry = countsByComment.get(r.comment_id) ?? { likes: 0, dislikes: 0, userReaction: null };
    if (r.reaction_type === "like") entry.likes++;
    else if (r.reaction_type === "dislike") entry.dislikes++;
    if (userId && r.user_id === userId) entry.userReaction = r.reaction_type as ReactionType;
    countsByComment.set(r.comment_id, entry);
  }

  return comments.map((comment) => {
    const counts = countsByComment.get(comment.id);
    return {
      ...comment,
      like_count: counts?.likes ?? 0,
      dislike_count: counts?.dislikes ?? 0,
      user_reaction: counts?.userReaction ?? null,
    };
  });
}

function nestReplies(flatComments: Omit<CommentData, "replies">[]): CommentData[] {
  const map = new Map<number, CommentData>();
  const topLevel: CommentData[] = [];

  for (const comment of flatComments) {
    map.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of flatComments) {
    const node = map.get(comment.id)!;
    if (comment.parent_id !== null && map.has(comment.parent_id)) {
      map.get(comment.parent_id)!.replies.push(node);
    } else {
      topLevel.push(node);
    }
  }

  return topLevel;
}

export async function getComments(
  movieId?: number,
  seriesId?: number,
  userId?: number
): Promise<CommentData[]> {
  try {
    if (movieId) {
      const movie = await db
        .select({ id: movies.id })
        .from(movies)
        .where(eq(movies.tmdb_id, movieId))
        .limit(1);

      if (movie.length === 0) return [];

      const results = await db
        .select({
          id: movieComments.id,
          content: movieComments.content,
          created_at: movieComments.created_at,
          updated_at: movieComments.updated_at,
          parent_id: movieComments.parent_id,
          user: {
            id: users.id,
            username: users.username,
            avatar_url: users.avatar_url,
            email: users.email,
          },
        })
        .from(movieComments)
        .innerJoin(users, eq(movieComments.user_id, users.id))
        .where(eq(movieComments.movie_id, movie[0].id))
        .orderBy(desc(movieComments.created_at));

      if (results.length === 0) return [];

      const commentIds = results.map((c) => c.id);
      const reactions = await db
        .select({
          comment_id: movieCommentReactions.comment_id,
          user_id: movieCommentReactions.user_id,
          reaction_type: movieCommentReactions.reaction_type,
        })
        .from(movieCommentReactions)
        .where(inArray(movieCommentReactions.comment_id, commentIds));

      return nestReplies(includeReactions(results, reactions, userId));
    }

    if (seriesId) {
      const series = await db
        .select({ id: tvSeries.id })
        .from(tvSeries)
        .where(eq(tvSeries.tmdb_id, seriesId))
        .limit(1);

      if (series.length === 0) return [];

      const results = await db
        .select({
          id: tvSeriesComments.id,
          content: tvSeriesComments.content,
          created_at: tvSeriesComments.created_at,
          updated_at: tvSeriesComments.updated_at,
          parent_id: tvSeriesComments.parent_id,
          user: {
            id: users.id,
            username: users.username,
            avatar_url: users.avatar_url,
            email: users.email,
          },
        })
        .from(tvSeriesComments)
        .innerJoin(users, eq(tvSeriesComments.user_id, users.id))
        .where(eq(tvSeriesComments.series_id, series[0].id))
        .orderBy(desc(tvSeriesComments.created_at));

      if (results.length === 0) return [];

      const commentIds = results.map((c) => c.id);
      const reactions = await db
        .select({
          comment_id: tvSeriesCommentReactions.comment_id,
          user_id: tvSeriesCommentReactions.user_id,
          reaction_type: tvSeriesCommentReactions.reaction_type,
        })
        .from(tvSeriesCommentReactions)
        .where(inArray(tvSeriesCommentReactions.comment_id, commentIds));

      return nestReplies(includeReactions(results, reactions, userId));
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
