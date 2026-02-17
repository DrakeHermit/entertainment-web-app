import NavBar from "@/components/NavBar";
import SearchComponent from "@/components/SearchComponent";
import BookmarkSetter from "@/components/BookmarkSetter";
import { getUserData, getUserId } from "@/lib/auth/checkSessionValid";
import { getUserBookmarks } from "@/actions/post/getUserBookmarks";
import { BookmarkProvider } from "@/contexts/BookmarkContext";
import { Suspense } from "react";

async function NavBarWithUser() {
  const user = await getUserData();
  return <NavBar user={user} />;
}

async function BookmarkHydrator() {
  const userId = await getUserId();
  if (!userId) return null;
  const bookmarks = await getUserBookmarks(userId);
  return <BookmarkSetter movies={bookmarks.movies} series={bookmarks.series} />;
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="md:p-6 lg:p-8">
      <Suspense fallback={<NavBar />}>
        <NavBarWithUser />
      </Suspense>
      <main className="text-white lg:ml-[140px] p-200 md:p-0">
        <SearchComponent />
        <BookmarkProvider initialMovies={[]} initialSeries={[]}>
          <Suspense>
            <BookmarkHydrator />
          </Suspense>
          {children}
        </BookmarkProvider>
      </main>
    </div>
  );
};

export default MainLayout;
