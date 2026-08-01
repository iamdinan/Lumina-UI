import axiosClient from "./axiosClient";

export async function searchSeries(query) {
  const res = await axiosClient.get("/series/search", { params: { q: query } });
  return res.data;
}

export async function importSeries(tmdbId) {
  const res = await axiosClient.post(`/series/${tmdbId}/import`);
  return res.data;
}

export async function getPopularSeries() {
  const res = await axiosClient.get("/series/popular");
  return res.data;
}

export async function getTopRatedSeries() {
  const res = await axiosClient.get("/series/top-rated");
  return res.data;
}

export async function getAiringTodaySeries() {
  const res = await axiosClient.get("/series/airing-today");
  return res.data;
}

export async function getOnTheAirSeries() {
  const res = await axiosClient.get("/series/on-the-air");
  return res.data;
}
