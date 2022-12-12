import axios, { AxiosInstance } from 'axios';
import { refresh } from './api/user';
import { removeRefreshToken, Token } from './cookie';

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

customAxios.interceptors.response.use(async (response) => {
  const {
    data: { status, message },
  } = response;

  if (status === 401) {
    if (message === 'jwt expired') {
      const accessToken = localStorage.getItem(Token.Access);

      const res = await refresh();
    }

    if (message === 'Please Again Login') {
      localStorage.removeItem(Token.Access);
      removeRefreshToken();
    }
  }

  return response;
});
