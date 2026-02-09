import NavBar from "@/components/NavBar";
import { BookmarkProvider } from "@/contexts/BookmarkContext";
import { getUserData } from "@/lib/auth/checkSessionValid";
import { getUserBookmarksData } from "@/actions/post/getUserBookmarksData";
import { getUserId } from "@/lib/server-helpers";

const BookmarksLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserData();
  const userIdData = await getUserId();
  const userId =
    userIdData && "userId" in userIdData
      ? parseInt(userIdData.userId)
      : undefined;
  const bookmarks = userId
    ? await getUserBookmarksData(userId)
    : { movies: [], series: [] };

  return (
    <div className="md:p-6 lg:p-8">
      <NavBar user={user} />
      <BookmarkProvider
        initialMovies={bookmarks.movies.map((movie) => movie.tmdb_id)}
        initialSeries={bookmarks.series.map((series) => series.tmdb_id)}
      >
        <main className="text-white lg:ml-[140px] p-200 md:p-0">
          {children}
        </main>
      </BookmarkProvider>
    </div>
  );
};

export default BookmarksLayout;
