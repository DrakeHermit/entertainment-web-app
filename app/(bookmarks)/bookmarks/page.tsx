import Link from "next/link";
import { IconBookmarkEmpty } from "@/components/Icons";
import { getSessionUser } from "@/lib/auth/checkSessionValid";

const BookmarksPage = async () => {
  const sessionUser = await getSessionUser();
  return sessionUser ? (
    <div className="flex flex-col mt-400">
      <h2 className="text-3xl font-medium text-white mb-400">
        Bookmarked Movies & TV Series
      </h2>
    </div>
  ) : (
    <div>
      <h2 className="text-3xl font-medium text-white mb-400 mt-400">
        Bookmarked Movies & TV Series
      </h2>

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
