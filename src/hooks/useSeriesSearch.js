import { useQuery } from "@tanstack/react-query";
import { searchSeries } from "@/api/series.api";

export function useSeriesSearch(query) {
  return useQuery({
    queryKey: ["seriesSearch", query],
    queryFn: () => searchSeries(query),
    enabled: query.trim().length > 0, // don't fire on empty query
  });
}
