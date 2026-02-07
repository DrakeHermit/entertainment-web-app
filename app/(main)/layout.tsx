import NavBar from "@/components/NavBar";
import SearchComponent from "@/components/SearchComponent";
import { getUserData } from "@/lib/auth/checkSessionValid";
import { getUserId } from "@/lib/server-helpers";
import { getUserBookmarks } from "@/actions/post/getUserBookmarks";
import { BookmarkProvider } from "@/contexts/BookmarkContext";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserData();
  const userIdData = await getUserId();
  const userId = userIdData && 'userId' in userIdData ? parseInt(userIdData.userId) : undefined;
  
  const bookmarks = userId ? await getUserBookmarks(userId) : { movies: [], series: [] };

  return (
    <div className="md:p-6 lg:p-8">
      <NavBar user={user} />
      <main className="text-white lg:ml-[140px] p-200 md:p-0">
        <SearchComponent />
        <BookmarkProvider initialMovies={bookmarks.movies} initialSeries={bookmarks.series}>
          {children}
        </BookmarkProvider>
      </main>
    </div>
  );
};

export default MainLayout;
