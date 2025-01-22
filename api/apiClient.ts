import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/", // Укажите базовый URL вашего API
  timeout: 10000, // Устанавливаем таймаут
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
