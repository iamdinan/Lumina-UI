import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SeriesLoading } from "@/components/SeriesLoading";
import {
  getPopularSeries,
  getTopRatedSeries,
  getAiringTodaySeries,
  getOnTheAirSeries,
  importSeries,
} from "@/api/series.api";

function SeriesGrid({
  series,
  isLoading,
  isError,
  title,
  onSelect,
  isPending,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>

      {isLoading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {isError && (
        <p className="text-error">Failed to load {title.toLowerCase()}.</p>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {series?.slice(0, 10).map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="text-left group"
              disabled={isPending}
            >
              <div className="aspect-2/3 bg-base-300 rounded-lg overflow-hidden mb-2">
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs opacity-50">
                    No image
                  </div>
                )}
              </div>
              <p className="text-sm font-medium line-clamp-2">{item.name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const {
    data: popular,
    isLoading: popularLoading,
    isError: popularError,
  } = useQuery({
    queryKey: ["popularSeries"],
    queryFn: getPopularSeries,
  });

  const {
    data: topRated,
    isLoading: topRatedLoading,
    isError: topRatedError,
  } = useQuery({
    queryKey: ["topRatedSeries"],
    queryFn: getTopRatedSeries,
  });

  const {
    data: airingToday,
    isLoading: airingTodayLoading,
    isError: airingTodayError,
  } = useQuery({
    queryKey: ["airingTodaySeries"],
    queryFn: getAiringTodaySeries,
  });

  const {
    data: onTheAir,
    isLoading: onTheAirLoading,
    isError: onTheAirError,
  } = useQuery({
    queryKey: ["onTheAirSeries"],
    queryFn: getOnTheAirSeries,
  });

  const importMutation = useMutation({
    mutationFn: importSeries,
    onSuccess: (data) => navigate(`/series/${data.series_id}`),
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to Lumina</h1>
        <p className="opacity-70 mb-6">What are we watching today?</p>
      </div>

      {importMutation.isPending && (
        <SeriesLoading fullScreen />
      )}

      <SeriesGrid
        series={popular}
        isLoading={popularLoading}
        isError={popularError}
        title="Popular Right Now"
        onSelect={(id) => importMutation.mutate(id)}
        isPending={importMutation.isPending}
      />

      <SeriesGrid
        series={topRated}
        isLoading={topRatedLoading}
        isError={topRatedError}
        title="Top Rated"
        onSelect={(id) => importMutation.mutate(id)}
        isPending={importMutation.isPending}
      />

      <SeriesGrid
        series={airingToday}
        isLoading={airingTodayLoading}
        isError={airingTodayError}
        title="Airing Today"
        onSelect={(id) => importMutation.mutate(id)}
        isPending={importMutation.isPending}
      />

      <SeriesGrid
        series={onTheAir}
        isLoading={onTheAirLoading}
        isError={onTheAirError}
        title="Currently On The Air"
        onSelect={(id) => importMutation.mutate(id)}
        isPending={importMutation.isPending}
      />
    </div>
  );
}
