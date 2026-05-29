import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 8000,
    headers: {
        Accept: "application/json"
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        //handle common errors
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } else if (error.response.status === 500) {
                console.error("Server error. Plese try again later.")
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again later.")
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;