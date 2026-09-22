const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];

const intensityClasses = [
  "bg-base-300",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
];

export function HeatmapLegend() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-base-content/65" aria-label="Color intensity indicates episodes watched">
      <span className="mr-1">Less</span>
      {intensityClasses.map((className, index) => (
        <span key={index} className={`h-3 w-3 rounded-sm ${className}`} />
      ))}
      <span className="ml-1">More</span>
    </div>
  );
}

function getIntensity(count) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export function MonthHeatmap({ month, counts, today }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
      <h3 className="mb-4 font-semibold">{month.label}</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {weekdayLabels.map((label, index) => (
          <span key={index} className="text-center text-xs text-base-content/50">
            {label}
          </span>
        ))}
        {month.dates.map((date, index) => {
          if (!date) return <span key={`blank-${index}`} />;

          const count = counts.get(date) || 0;
          const isFuture = date > today;
          const description = isFuture
            ? `${date}: upcoming`
            : `${date}: ${count} ${count === 1 ? "episode" : "episodes"} watched`;

          return (
            <span
              key={date}
              role="img"
              title={description}
              aria-label={description}
              className={`aspect-square rounded-sm ${isFuture ? "bg-base-200/40" : intensityClasses[getIntensity(count)]}`}
            />
          );
        })}
      </div>
    </div>
  );
}
