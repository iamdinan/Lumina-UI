import axiosClient from "./axiosClient";

export async function downloadWatchHistory() {
  const response = await axiosClient.get("/users/me/watch-history/export", {
    responseType: "blob",
  });
  return response.data;
}
