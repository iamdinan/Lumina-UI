import axiosClient from "./axiosClient";

export async function getSeriesProgress(seriesId) {
  const res = await axiosClient.get(`/users/me/series/${seriesId}/progress`);
  return res.data;
}

export async function markWatched(episodeId) {
  const res = await axiosClient.post(`/users/me/episodes/${episodeId}`);
  return res.data;
}

export async function unmarkWatched(episodeId) {
  const res = await axiosClient.delete(`/users/me/episodes/${episodeId}`);
  return res.data;
}

export async function markSeriesCompleted(seriesId) {
  const res = await axiosClient.post(
    `/users/me/series/${seriesId}/mark-completed`,
  );
  return res.data;
}
