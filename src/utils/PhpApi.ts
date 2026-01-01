import axios from "axios";

const phpApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PHP_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

phpApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

phpApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert("Your session has expired. Please login again.");
      window.open(
        `${process.env.NEXT_PUBLIC_PHP_URL}/index.php`,
        "_blank",
        "noopener,noreferrer"
      );
    }
    return Promise.reject(error);
  }
);

export default phpApi;
