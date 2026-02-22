import { notFound } from "next/navigation";
import Image from "next/image";
import { Film, Star, Clock, Calendar, DollarSign } from "lucide-react";
import { getMovieDetails } from "@/lib/tmdb";
import { getUserId } from "@/lib/auth/checkSessionValid";
import BookmarkButton from "@/components/BookmarkButton";
import DetailsBackButton from "@/components/DetailsBackButton";
import CommentField from "@/components/CommentField";
import CommentList from "@/components/CommentList";
import { CommentProvider } from "@/contexts/CommentContext";
import { getComments } from "@/queries/comments/getComments";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MovieDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const movie = await getMovieDetails(parseInt(id));

  if (!movie) {
    notFound();
  }

  const userId = (await getUserId()) ?? undefined;
  const comments = await getComments(movie.id);

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div>
      <DetailsBackButton />

      <div className="relative w-full aspect-video md:aspect-21/9 rounded-xl overflow-hidden mb-8">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
            <Film className="w-4 h-4" />
            <span>Movie</span>
            <span>•</span>
            <span>{new Date(movie.release_date).getFullYear()}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="text-lg text-white/70 italic">{movie.tagline}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="hidden md:block sticky top-4">
          <div className="relative aspect-2/3 rounded-lg overflow-hidden">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                sizes="300px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <Film className="w-16 h-16 text-white/30" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-semi-dark-blue px-4 py-2 rounded-lg">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-white/50 text-sm">
                ({movie.vote_count.toLocaleString()} votes)
              </span>
            </div>
            <div className="flex items-center gap-2 bg-semi-dark-blue px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-white/70" />
              <span className="text-white">{formatRuntime(movie.runtime)}</span>
            </div>
            <div className="flex items-center gap-2 bg-semi-dark-blue px-4 py-2 rounded-lg">
              <Calendar className="w-5 h-5 text-white/70" />
              <span className="text-white">
                {new Date(movie.release_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <BookmarkButton
              id={movie.id}
              title={movie.title}
              year={new Date(movie.release_date).getFullYear()}
              category="Movie"
              rating={movie.vote_average.toFixed(1)}
              thumbnail={
                movie.backdrop_path
                  ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                  : undefined
              }
              userId={userId}
            />
          </div>

          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-red/20 text-red px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
            <p className="text-white/80 leading-relaxed">
              {movie.overview || "No overview available."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-semi-dark-blue p-4 rounded-lg">
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Budget</span>
              </div>
              <p className="text-white font-semibold text-lg">
                {formatCurrency(movie.budget)}
              </p>
            </div>
            <div className="bg-semi-dark-blue p-4 rounded-lg">
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Revenue</span>
              </div>
              <p className="text-white font-semibold text-lg">
                {formatCurrency(movie.revenue)}
              </p>
            </div>
          </div>

          {movie.production_companies.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Production Companies
              </h2>
              <div className="flex flex-wrap gap-3">
                {movie.production_companies.map((company) => (
                  <span
                    key={company.id}
                    className="bg-semi-dark-blue px-3 py-2 rounded-lg text-white/80 text-sm"
                  >
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <CommentProvider initialComments={comments} userId={userId ?? 0}>
        <CommentField
          userId={userId ?? 0}
          movieId={movie.id}
          seriesId={null ?? 0}
        />
        <CommentList />
      </CommentProvider>
    </div>
  );
}
