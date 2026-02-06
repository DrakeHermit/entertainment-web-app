'use server';

import { cookies } from "next/headers";
import { AddBookmarkProps } from "@/lib/types/types";
import { db } from "@/lib/db/drizzle";
import { bookmarkedMovies, bookmarkedTvSeries, movies, tvSeries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
      let existingMovie = await db
        .select()
        .from(movies)
        .where(eq(movies.tmdb_id, id))
        .limit(1);

      let movieId;
      if (existingMovie.length === 0) {
        const newMovie = await db.insert(movies).values({
          tmdb_id: id,
          title: title,
          backdrop_path: thumbnail || "",
          release_date: new Date(year, 0, 1),
          rating: parseFloat(rating),
        }).returning();
        movieId = newMovie[0].id;
      } else {
        movieId = existingMovie[0].id;
      }

      await db.insert(bookmarkedMovies).values({
        user_id: userId,
        movie_id: movieId,
      });

    } else {
      let existingSeries = await db
        .select()
        .from(tvSeries)
        .where(eq(tvSeries.tmdb_id, id))
        .limit(1);

      let seriesId;
      if (existingSeries.length === 0) {
        const newSeries = await db.insert(tvSeries).values({
          tmdb_id: id,
          name: title, 
          backdrop_path: thumbnail || "",
          first_air_date: new Date(year, 0, 1),
          rating: parseFloat(rating),
        }).returning();
        seriesId = newSeries[0].id;
      } else {
        seriesId = existingSeries[0].id;
      }

      await db.insert(bookmarkedTvSeries).values({
        user_id: userId,
        series_id: seriesId,
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to add bookmark", success: false };
  }
}