import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT to every request automatically
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("lumina_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired/invalid tokens globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("lumina_token");
      // Let the app react to this via AuthContext rather than force-redirecting here
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
