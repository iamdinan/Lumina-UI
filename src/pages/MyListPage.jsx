import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { getMySeries, removeSeriesFromList } from "@/api/userSeries.api";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Watching", value: "watching" },
  { label: "Watchlist", value: "watchlist" },
  { label: "Completed", value: "completed" },
];

export default function MyListPage() {
  const [activeStatus, setActiveStatus] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mySeries", activeStatus],
    queryFn: () => getMySeries(activeStatus || undefined),
  });

  const removeMutation = useMutation({
    mutationFn: (seriesId) => removeSeriesFromList(seriesId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mySeries"] }),
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My List</h1>

      <div role="tablist" className="tabs tabs-boxed w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            className={`tab ${activeStatus === tab.value ? "tab-active" : ""}`}
            onClick={() => setActiveStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center mt-8">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {isError && <p className="text-error">Failed to load your list.</p>}

      {data && data.length === 0 && (
        <div className="mt-8 rounded-3xl border border-base-300 bg-base-100/80 p-8 shadow-sm">
          <div className="mx-auto flex max-w-md flex-col items-center text-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Your list is empty</h2>
              <p className="text-sm opacity-70">
                Add a series to keep track of what you want to watch, what you
                are watching, or what you have finished.
              </p>
            </div>
            <Link
              to="/search"
              state={{ focusSearch: true }}
              className="btn btn-primary rounded-full px-6"
            >
              Search for a series
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data?.map((item) => (
          <div key={item.series_id} className="card bg-base-100 shadow-md">
            <Link to={`/series/${item.series_id}`}>
              <figure className="aspect-[2/3] bg-base-300">
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                    alt={item.series_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs opacity-50">
                    No image
                  </div>
                )}
              </figure>
            </Link>
            <div className="card-body p-3 gap-2">
              <Link to={`/series/${item.series_id}`}>
                <p className="text-sm font-medium line-clamp-2">
                  {item.series_name}
                </p>
              </Link>

              <button
                className="btn btn-error btn-outline btn-xs"
                onClick={() => removeMutation.mutate(item.series_id)}
                disabled={removeMutation.isPending}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
