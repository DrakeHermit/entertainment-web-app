'use server';

import { cookies } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { movieComments, tvSeriesComments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function postComment(
  userId: number,
  movieId: number,
  content: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return { error: "Unauthorized" };
  }
}