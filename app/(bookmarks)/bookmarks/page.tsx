import Link from "next/link";
import { IconBookmarkEmpty } from "@/components/Icons";
import { getUserId } from "@/lib/auth/checkSessionValid";
import { getUserBookmarksData } from "@/actions/post/getUserBookmarksData";
import RecommendedCard from "@/components/RecommendedCard";

const BookmarksPage = async () => {
  const userId = (await getUserId()) ?? undefined;
  const bookmarksData = userId
    ? await getUserBookmarksData(userId)
    : { movies: [], series: [] };

  const hasBookmarks =
    bookmarksData.movies.length > 0 || bookmarksData.series.length > 0;

  return userId ? (
    <div className="flex flex-col mt-400">
      <h2 className="text-3xl font-medium text-white mb-400">
        Bookmarked Movies & TV Series
      </h2>

      {!hasBookmarks ? (
        <div className="flex flex-col items-center justify-center py-800 text-center">
          <div className="w-20 h-20 bg-semi-dark-blue rounded-full flex items-center justify-center mb-400">
            <IconBookmarkEmpty className="w-10 h-10 text-white/50" />
          </div>
          <h3 className="text-xl font-medium text-white mb-200">
            No bookmarks yet
          </h3>
          <p className="text-white/75 max-w-md">
            Start bookmarking your favorite movies and TV series to see them
            here.
          </p>
        </div>
      ) : (
        <div className="space-y-800">
          {bookmarksData.movies.length > 0 && (
            <div>
              <h3 className="text-2xl font-medium text-white mb-400">
                Bookmarked Movies
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-400">
                {bookmarksData.movies.map((movie) => (
                  <RecommendedCard
                    key={`movie-${movie.id}`}
                    id={movie.tmdb_id}
                    title={movie.title}
                    year={new Date(movie.release_date).getFullYear()}
                    category="Movie"
                    rating={movie.rating.toString()}
                    thumbnail={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    userId={userId}
                  />
                ))}
              </div>
            </div>
          )}

          {bookmarksData.series.length > 0 && (
            <div>
              <h3 className="text-2xl font-medium text-white mb-400">
                Bookmarked TV Series
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-400">
                {bookmarksData.series.map((series) => (
                  <RecommendedCard
                    key={`series-${series.id}`}
                    id={series.tmdb_id}
                    title={series.name}
                    year={new Date(series.first_air_date).getFullYear()}
                    category="TV Series"
                    rating={series.rating.toString()}
                    thumbnail={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
                    userId={userId}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <div>
      <div className="flex flex-col items-center justify-center py-1000 px-200 text-center">
        <div className="mb-600 flex flex-col items-center gap-400">
          <div className="w-20 h-20 bg-semi-dark-blue rounded-full flex items-center justify-center mb-200">
            <IconBookmarkEmpty className="w-10 h-10 text-white/50" />
          </div>

          <div className="space-y-200">
            <h3 className="text-2xl font-medium text-white">
              Your bookmarks are empty
            </h3>
            <p className="text-white/75 max-w-md">
              Start bookmarking your favorite movies and TV series to watch them
              later. Sign up or log in to save your bookmarks across all your
              devices.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-300 items-center">
          <Link
            href="/register"
            className="bg-red hover:bg-white hover:text-background text-white px-600 py-300 rounded-md font-light text-[15px] transition-colors cursor-pointer inline-block"
          >
            Create an account
          </Link>
          <span className="text-white/50 text-sm">or</span>
          <Link
            href="/login"
            className="text-white/75 hover:text-white underline text-[15px] transition-colors"
          >
            Sign in to an existing account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;
