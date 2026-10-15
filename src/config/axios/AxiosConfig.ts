import axios, { HttpStatusCode, type AxiosInstance } from 'axios';
import { getAccessToken, removeAccessToken } from '@/utils/cookieUtils';
import { useAuthStore } from '@/store/authStore';

/*
* prod 빌드가 호출할 백엔드 주소 (.env.production 의 VITE_PROD_API_BASE_URL, 빌드할 때 값이 박힌다)
* local 에서는 비어 있어서 같은 출처(Vite 프록시)로 호출한다
* */
export const BASE_URL: string = (import.meta.env.VITE_PROD_API_BASE_URL ?? '').replace(/\/$/, '');

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

/**
 * Request Interceptor: 모든 요청에 쿠키의 토큰을 붙인다
 */
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Response Interceptor: 401/403이면 토큰과 사용자 정보를 비운다
 * (로그인 화면으로 보내는 일은 RequireAuth 가 한다)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === HttpStatusCode.Unauthorized || status === HttpStatusCode.Forbidden) {
      removeAccessToken();
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);
