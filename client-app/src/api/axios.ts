import axios from "axios";
import { store } from "../store/store";

// Адрес твоего основного бэкенд-сервиса
const API_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
});

// Это "перехватчик" (interceptor), который будет срабатывать перед каждым запросом
api.interceptors.request.use((config) => {
  // Получаем текущее состояние Redux
  const state = store.getState();
  const token = state.auth.token;

  // Если токен есть, добавляем его в заголовок Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
