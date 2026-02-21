import { notFound } from "next/navigation";
import Image from "next/image";
import { Tv, Star, Calendar, Layers, Film as FilmIcon } from "lucide-react";
import { getTVSeriesDetails } from "@/lib/tmdb";
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

export default async function TVSeriesDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const tvSeries = await getTVSeriesDetails(parseInt(id));

  if (!tvSeries) {
    notFound();
  }

  const userId = (await getUserId()) ?? undefined;
  const comments = await getComments(undefined, tvSeries.id);

  return (
    <div className="pb-8">
      <DetailsBackButton />

      <div className="relative w-full aspect-video md:aspect-21/9 rounded-xl overflow-hidden mb-8">
        {tvSeries.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${tvSeries.backdrop_path}`}
            alt={tvSeries.name}
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
            <Tv className="w-4 h-4" />
            <span>TV Series</span>
            <span>•</span>
            <span>{new Date(tvSeries.first_air_date).getFullYear()}</span>
            {tvSeries.in_production && (
              <>
                <span>•</span>
                <span className="text-green-400">In Production</span>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {tvSeries.name}
          </h1>
          {tvSeries.tagline && (
            <p className="text-lg text-white/70 italic">{tvSeries.tagline}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="hidden md:block sticky top-4">
          <div className="relative aspect-2/3 rounded-lg overflow-hidden">
            {tvSeries.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${tvSeries.poster_path}`}
                alt={tvSeries.name}
                fill
                sizes="300px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <Tv className="w-16 h-16 text-white/30" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-semi-dark-blue px-4 py-2 rounded-lg">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold">
                {tvSeries.vote_average.toFixed(1)}
              </span>
              <span className="text-white/50 text-sm">
                ({tvSeries.vote_count.toLocaleString()} votes)
              </span>
            </div>
            <div className="flex items-center gap-2 bg-semi-dark-blue px-4 py-2 rounded-lg">
              <Layers className="w-5 h-5 text-white/70" />
              <span className="text-white">
                {tvSeries.number_of_seasons} Season
                {tvSeries.number_of_seasons !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-semi-dark-blue px-4 py-2 rounded-lg">
              <FilmIcon className="w-5 h-5 text-white/70" />
              <span className="text-white">
                {tvSeries.number_of_episodes} Episode
                {tvSeries.number_of_episodes !== 1 ? "s" : ""}
              </span>
            </div>
            <BookmarkButton
              id={tvSeries.id}
              title={tvSeries.name}
              year={new Date(tvSeries.first_air_date).getFullYear()}
              category="TV Series"
              rating={tvSeries.vote_average.toFixed(1)}
              thumbnail={
                tvSeries.backdrop_path
                  ? `https://image.tmdb.org/t/p/w500${tvSeries.backdrop_path}`
                  : undefined
              }
              userId={userId}
            />
          </div>

          {tvSeries.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tvSeries.genres.map((genre) => (
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
              {tvSeries.overview || "No overview available."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-semi-dark-blue p-4 rounded-lg">
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">First Air Date</span>
              </div>
              <p className="text-white font-semibold">
                {new Date(tvSeries.first_air_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="bg-semi-dark-blue p-4 rounded-lg">
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Last Air Date</span>
              </div>
              <p className="text-white font-semibold">
                {tvSeries.last_air_date
                  ? new Date(tvSeries.last_air_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  : "Ongoing"}
              </p>
            </div>
          </div>

          <div className="bg-semi-dark-blue p-4 rounded-lg inline-block">
            <span className="text-white/70 text-sm">Status: </span>
            <span
              className={`font-semibold ${
                tvSeries.status === "Returning Series"
                  ? "text-green-400"
                  : tvSeries.status === "Ended"
                  ? "text-red"
                  : "text-white"
              }`}
            >
              {tvSeries.status}
            </span>
          </div>

          {tvSeries.created_by.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Created By
              </h2>
              <div className="flex flex-wrap gap-3">
                {tvSeries.created_by.map((creator) => (
                  <span
                    key={creator.id}
                    className="bg-semi-dark-blue px-3 py-2 rounded-lg text-white/80 text-sm"
                  >
                    {creator.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tvSeries.production_companies.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Production Companies
              </h2>
              <div className="flex flex-wrap gap-3">
                {tvSeries.production_companies.map((company) => (
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
      <CommentProvider initialComments={comments}>
        <CommentField
          userId={userId ?? 0}
          movieId={null ?? 0}
          seriesId={tvSeries.id}
        />
        <CommentList />
      </CommentProvider>
    </div>
  );
}
