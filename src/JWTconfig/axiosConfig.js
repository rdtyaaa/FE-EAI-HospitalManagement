// axiosConfig.js
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAxiosConfig = (serviceURL) => {
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: serviceURL,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosConfig;
