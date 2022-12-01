import axios, { AxiosInstance } from 'axios';
import { Token } from './cookie';

export const customAxios: AxiosInstance = axios.create({
  baseURL: `/api`,
  timeout: 1000,
});

customAxios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(Token.Access);

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// customAxios.defaults.headers.common['Authorization'] = `Bearer ${}`;
