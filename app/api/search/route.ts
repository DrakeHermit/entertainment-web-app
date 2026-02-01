import { searchMulti } from "@/lib/tmdb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.trim() === "") {
    return Response.json([]);
  }
  const results = await searchMulti(q.trim());
  return Response.json(results);
}
