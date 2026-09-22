import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Flame } from "lucide-react";
import { getWatchActivity } from "@/api/userEpisodes.api";
import { HeatmapLegend, MonthHeatmap } from "@/components/activity/MonthHeatmap";
import { getMonths } from "@/utils/activityCalendar";

export default function MyActivityPage() {
  const [selectedYear, setSelectedYear] = useState(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myActivity", selectedYear],
    queryFn: () => getWatchActivity(selectedYear),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isError) {
    return <p className="mt-8 text-center text-error">Failed to load your activity.</p>;
  }

  const counts = new Map(data.days.map(({ date, count }) => [date, count]));
  const episodesThisYear = data.days.reduce((sum, day) => sum + day.count, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Activity</h1>
          <p className="mt-1 text-sm text-base-content/65">
            Your watched episodes in {data.year}.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm" htmlFor="activity-year">
          Year
          <select
            id="activity-year"
            className="select select-sm border-base-300 focus:border-base-300 focus:outline-none focus:ring-0 focus-visible:outline-2 focus-visible:outline-primary"
            value={data.year}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
          >
            {data.available_years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-5">
          <div className="rounded-xl bg-primary/15 p-3 text-primary">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-base-content/65">Current streak</p>
            <p className="text-3xl font-bold">
              {data.current_streak}{" "}
              <span className="text-base font-medium">
                {data.current_streak === 1 ? "day" : "days"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-5">
          <div className="rounded-xl bg-primary/15 p-3 text-primary">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-base-content/65">Episodes watched in {data.year}</p>
            <p className="text-3xl font-bold">{episodesThisYear}</p>
          </div>
        </div>
      </div>

      <section aria-label="Monthly watch activity" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Watch calendar</h2>
          <HeatmapLegend />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {getMonths(data.year).map((month) => (
            <MonthHeatmap
              key={month.label}
              month={month}
              counts={counts}
              today={data.today}
            />
          ))}
        </div>
        <p className="text-xs text-base-content/55">
          A day counts toward your streak when you mark at least one episode watched.
          The streak stays active until the end of today if you watched yesterday.
        </p>
      </section>
    </div>
  );
}
