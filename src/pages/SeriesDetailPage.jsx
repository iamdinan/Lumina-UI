import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SeriesLoading } from "@/components/SeriesLoading";
import {
  getSeriesProgress,
  markWatched,
  unmarkWatched,
} from "@/api/userEpisodes.api";
import {
  getSeriesStatus,
  addSeriesToList,
  removeSeriesFromList,
} from "@/api/userSeries.api";
import { markSeriesCompleted } from "@/api/userEpisodes.api";

export default function SeriesDetailPage() {
  const { seriesId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["seriesProgress", seriesId],
    queryFn: () => getSeriesProgress(seriesId),
  });

  const { data: statusData } = useQuery({
    queryKey: ["seriesStatus", seriesId],
    queryFn: () => getSeriesStatus(seriesId),
  });

  const isCompleted = statusData?.status === "completed";

  const toggleWatchlistMutation = useMutation({
    mutationFn: () =>
      statusData?.status
        ? removeSeriesFromList(seriesId)
        : addSeriesToList(seriesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seriesProgress", seriesId] });
      queryClient.invalidateQueries({ queryKey: ["seriesStatus", seriesId] });
      queryClient.invalidateQueries({ queryKey: ["mySeries"] });
      queryClient.invalidateQueries({ queryKey: ["myStats"] });
      queryClient.invalidateQueries({ queryKey: ["myActivity"] });
    },
  });

  const toggleCompletedMutation = useMutation({
    mutationFn: () =>
      isCompleted
        ? removeSeriesFromList(seriesId)
        : markSeriesCompleted(seriesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seriesProgress", seriesId] });
      queryClient.invalidateQueries({ queryKey: ["seriesStatus", seriesId] });
      queryClient.invalidateQueries({ queryKey: ["mySeries"] });
      queryClient.invalidateQueries({ queryKey: ["myStats"] });
      queryClient.invalidateQueries({ queryKey: ["myActivity"] });
    },
  });

  const toggleWatchedMutation = useMutation({
    mutationFn: ({ episodeId, watched }) =>
      watched ? unmarkWatched(episodeId) : markWatched(episodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seriesProgress", seriesId] });
      queryClient.invalidateQueries({ queryKey: ["myStats"] });
      queryClient.invalidateQueries({ queryKey: ["myActivity"] });
    },
  });

  if (isLoading) {
    return <SeriesLoading />;
  }

  if (isError) {
    return (
      <p className="text-center text-error mt-8">Failed to load series.</p>
    );
  }

  const { total_episodes, watched_episodes, seasons } = data;
  const percent =
    total_episodes > 0
      ? Math.round((watched_episodes / total_episodes) * 100)
      : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Series Progress</h1>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            className={`btn btn-sm rounded-full px-4 ${isCompleted ? "btn-disabled" : statusData?.status ? "btn-outline" : "btn-primary"}`}
            onClick={() => toggleWatchlistMutation.mutate()}
            disabled={toggleWatchlistMutation.isPending || isCompleted}
          >
            {isCompleted
              ? "Completed"
              : toggleWatchlistMutation.isPending
                ? "Updating..."
                : statusData?.status === "watchlist"
                  ? "On Watchlist"
                  : statusData?.status
                    ? `${statusData.status.charAt(0).toUpperCase()}${statusData.status.slice(1)}`
                    : "Add to Watchlist"}
          </button>
          <button
            className={`btn btn-sm rounded-full px-4 ${isCompleted ? "btn-error" : "btn-secondary text-secondary-content"}`}
            onClick={() => toggleCompletedMutation.mutate()}
            disabled={toggleCompletedMutation.isPending}
          >
            {toggleCompletedMutation.isPending
              ? isCompleted
                ? "Removing..."
                : "Marking..."
              : isCompleted
                ? "Remove Series"
                : "Mark All Completed"}
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>
            {watched_episodes} / {total_episodes} episodes watched
          </span>
          <span>{percent}%</span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={percent}
          max="100"
        />
      </div>

      <div className="space-y-4">
        {seasons.map((season) => (
          <div
            key={season.season_no}
            className="collapse collapse-arrow bg-base-100 border border-base-300"
          >
            <input type="checkbox" defaultChecked={season.season_no === 1} />
            <div className="collapse-title font-medium">
              Season {season.season_no}
              <span className="text-sm opacity-60 ml-2">
                ({season.episodes.filter((e) => e.watched).length}/
                {season.episodes.length} watched)
              </span>
            </div>
            <div className="collapse-content">
              <ul className="space-y-2">
                {season.episodes.map((ep) => (
                  <li
                    key={ep.episode_id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-sm font-medium">
                        E{ep.episode_no}. {ep.episode_name}
                      </span>
                      {ep.air_date && (
                        <span className="text-xs opacity-50 ml-2">
                          {ep.air_date}
                        </span>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      checked={ep.watched}
                      onChange={() =>
                        toggleWatchedMutation.mutate({
                          episodeId: ep.episode_id,
                          watched: ep.watched,
                        })
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
