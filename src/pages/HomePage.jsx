import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getPopularSeries, importSeries } from "@/api/series.api";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: popular,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["popularSeries"],
    queryFn: getPopularSeries,
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

      <div>
        <h2 className="text-xl font-semibold mb-4">Popular Right Now</h2>

        {isLoading && (
          <div className="flex justify-center mt-8">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}

        {isError && (
          <p className="text-error">Failed to load popular series.</p>
        )}

        {importMutation.isPending && (
          <div className="alert alert-info mb-4">
            <span className="loading loading-spinner loading-sm" />
            <span>Loading series...</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {popular?.slice(0, 10).map((series) => (
            <button
              key={series.id}
              onClick={() => importMutation.mutate(series.id)}
              className="text-left group"
              disabled={importMutation.isPending}
            >
              <div className="aspect-[2/3] bg-base-300 rounded-lg overflow-hidden mb-2">
                {series.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${series.poster_path}`}
                    alt={series.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs opacity-50">
                    No image
                  </div>
                )}
              </div>
              <p className="text-sm font-medium line-clamp-2">{series.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
