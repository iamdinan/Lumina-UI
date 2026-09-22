import { useMutation } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { downloadWatchHistory } from "@/api/watchHistory.api";
import { useAuth } from "@/hooks/useAuth";

export default function ExportPage() {
  const { user } = useAuth();
  const exportMutation = useMutation({
    mutationFn: downloadWatchHistory,
    onSuccess: (csv) => {
      const url = URL.createObjectURL(csv);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${user.username}_lumina_watch_history.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Export</h1>
        <p className="mt-1 text-sm text-base-content/65">
          Download your watch history as a CSV file.
        </p>
      </div>

      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/15 p-3 text-primary">
            <Download className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Watch history</h2>
            <p className="text-sm text-base-content/65">
              Includes every episode currently marked watched, with its series,
              season, episode, watch date, air date, runtime, and current series status.
            </p>
            <p className="break-all text-xs text-base-content/50">
              {user.username}_lumina_watch_history.csv
            </p>
          </div>
        </div>

        {exportMutation.isError && (
          <div className="alert alert-error mt-5 text-sm">
            Could not export your watch history. Please try again.
          </div>
        )}

        <button
          type="button"
          className="btn btn-primary mt-6"
          disabled={exportMutation.isPending}
          onClick={() => exportMutation.mutate()}
        >
          <Download className="h-4 w-4" />
          {exportMutation.isPending ? "Preparing CSV..." : "Download CSV"}
        </button>
      </div>
    </div>
  );
}
