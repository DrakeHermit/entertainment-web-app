'use server';

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { AddBookmarkProps } from "@/lib/types/types";
import { db } from "@/lib/db/drizzle";
import { bookmarkedMovies, bookmarkedTvSeries, movies, tvSeries } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function addBookmark(
  userId: number, 
  { id, title, year, category, rating, thumbnail }: AddBookmarkProps
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { error: "Unauthorized" };
  }

  try {
    if (category === "Movie") {
      const [movie] = await db
        .insert(movies)
        .values({
          tmdb_id: id,
          title: title,
          backdrop_path: thumbnail || "",
          release_date: new Date(year, 0, 1),
          rating: parseFloat(rating),
        })
        .onConflictDoUpdate({
          target: movies.tmdb_id,
          set: { title: sql`excluded.title` },
        })
        .returning({ id: movies.id });

      const existingBookmark = await db
        .select()
        .from(bookmarkedMovies)
        .where(
          and(
            eq(bookmarkedMovies.user_id, userId),
            eq(bookmarkedMovies.movie_id, movie.id),
          )
        )
        .limit(1);

      if (existingBookmark.length > 0) {
        return { success: true };
      }

      await db.insert(bookmarkedMovies).values({
        user_id: userId,
        movie_id: movie.id,
      });

    } else {
      const [series] = await db
        .insert(tvSeries)
        .values({
          tmdb_id: id,
          name: title,
          backdrop_path: thumbnail || "",
          first_air_date: new Date(year, 0, 1),
          rating: parseFloat(rating),
        })
        .onConflictDoUpdate({
          target: tvSeries.tmdb_id,
          set: { name: sql`excluded.name` },
        })
        .returning({ id: tvSeries.id });

      const existingBookmark = await db
        .select()
        .from(bookmarkedTvSeries)
        .where(
          and(
            eq(bookmarkedTvSeries.user_id, userId),
            eq(bookmarkedTvSeries.series_id, series.id),
          )
        )
        .limit(1);

      if (existingBookmark.length > 0) {
        return { success: true };
      }

      await db.insert(bookmarkedTvSeries).values({
        user_id: userId,
        series_id: series.id,
      });
    }

    revalidatePath('/bookmarks');
    revalidatePath('/');
    revalidatePath('/movies');
    revalidatePath('/tv-series');
    revalidatePath(`/${category === 'Movie' ? 'movie' : 'tv'}/${id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to add bookmark", success: false };
  }
}