import axiosClient from "./axiosClient";

export async function registerUser(username, password) {
  const res = await axiosClient.post("/users/register", { username, password });
  return res.data;
}

export async function loginUser(username, password) {
  const res = await axiosClient.post("/users/login", { username, password });
  return res.data; // { token, user }
}

export async function getMe() {
  const res = await axiosClient.get("/users/me");
  return res.data;
}

export async function updateProfile(data) {
  const res = await axiosClient.patch("/users/me", data);
  return res.data;
}

export async function getMyStats() {
  const res = await axiosClient.get("/users/me/stats");
  return res.data;
}
