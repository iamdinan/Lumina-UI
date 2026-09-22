export function SeriesLoading({ fullScreen = false }) {
  return (
    <div
      role="status"
      aria-label="Loading series"
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-base-200/80"
          : "flex min-h-[calc(100vh-8rem)] items-center justify-center"
      }
    >
      <span className="loading loading-spinner loading-lg text-primary" aria-hidden="true" />
    </div>
  );
}
