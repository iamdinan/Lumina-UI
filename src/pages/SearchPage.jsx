import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sparkles, Search as SearchIcon } from "lucide-react";
import { searchSeries, importSeries } from "@/api/series.api";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["seriesSearch", query],
    queryFn: () => searchSeries(query),
    enabled: !!query,
  });

  const importMutation = useMutation({
    mutationFn: importSeries,
    onSuccess: (data) => navigate(`/series/${data.series_id}`),
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="rounded-3xl border border-base-300 bg-base-100/80 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Discover series
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {query ? `Results for "${query}"` : "Search Series"}
            </h1>
            <p className="max-w-2xl text-sm opacity-70 sm:text-base">
              Search a series, import it into Lumina, and start tracking it in a
              clean watchlist flow.
            </p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center mt-8">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {isError && (
        <div className="alert alert-error mb-4">
          <span>Failed to search. Please try again.</span>
        </div>
      )}

      {importMutation.isPending && (
        <div className="alert alert-info mb-4 rounded-2xl border-0">
          <span className="loading loading-spinner loading-sm" />
          <span>Importing series details...</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {results?.map((series) => (
          <button
            key={series.id}
            onClick={() => importMutation.mutate(series.id)}
            className="group text-left transition-transform duration-200 hover:-translate-y-1 disabled:cursor-not-allowed"
            disabled={importMutation.isPending}
          >
            <div className="mb-2 overflow-hidden rounded-2xl bg-base-300 shadow-sm ring-1 ring-base-300 transition-shadow group-hover:shadow-md">
              {series.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w342${series.poster_path}`}
                  alt={series.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex aspect-[2/3] w-full items-center justify-center text-xs opacity-50">
                  No image available
                </div>
              )}
            </div>
            <p className="line-clamp-2 text-sm font-medium leading-snug">
              {series.name}
            </p>
            <p className="text-xs opacity-60">
              {series.first_air_date
                ? series.first_air_date.slice(0, 4)
                : "N/A"}
            </p>
          </button>
        ))}
      </div>

      {results && results.length === 0 && (
        <div className="rounded-3xl border border-base-300 bg-base-100/70 p-8 text-center shadow-sm">
          <p className="text-base font-medium">No results found</p>
          <p className="mt-2 text-sm opacity-70">
            Try a different title or use the search bar again with another
            keyword.
          </p>
        </div>
      )}
    </div>
  );
}
