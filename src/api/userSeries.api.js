import axiosClient from "./axiosClient";

export async function addSeriesToList(seriesId, status = "watching") {
  const res = await axiosClient.post(`/users/me/series/${seriesId}`, {
    status,
  });
  return res.data;
}

export async function removeSeriesFromList(seriesId) {
  await axiosClient.delete(`/users/me/series/${seriesId}`);
}

export async function getMySeries(status) {
  const res = await axiosClient.get("/users/me/series", {
    params: status ? { status } : {},
  });
  return res.data;
}

export async function getSeriesStatus(seriesId) {
  const res = await axiosClient.get(`/users/me/series/${seriesId}/status`);
  return res.data;
}
