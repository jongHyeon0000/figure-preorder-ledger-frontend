import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import { useAuthStore } from '@/store/authStore';
import { removeAccessToken, setAccessToken } from '@/utils/cookieUtils';
import type { LoginRequestBody } from '@/app/auth/interface/LoginRequestBody';
import type { LoginResponseData } from '@/app/auth/interface/LoginResponseData';
import type { UserInfo } from '@/app/auth/interface/UserInfo';

/**
 * 로그인 훅
 *
 * 로그인 응답에는 토큰만 있어서, 토큰을 쿠키에 저장한 뒤 GET /api/auth/me 로 사용자 정보를 한 번 더 가져온다.
 * 결과의 code, message 는 로그인 응답의 것이고 data 는 사용자 정보다.
 */
const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const setUser = useAuthStore((state) => state.setUser);

  const fetchLogin = async (body: LoginRequestBody): Promise<ApiResponse<UserInfo | null>> => {
    setLoading(true);
    try {
      const loginRes = await api.post<ApiResponse<LoginResponseData>>('/api/auth/login', body);
      setAccessToken(loginRes.data.data.accessToken);

      const meRes = await api.get<ApiResponse<UserInfo>>('/api/auth/me');
      setUser(meRes.data.data);

      return { ...loginRes.data, data: meRes.data.data };
    } catch (err) {
      /* 로그인은 됐는데 사용자 정보를 못 가져온 경우에 토큰이 남지 않게 한다 */
      removeAccessToken();
      return toApiResponse<UserInfo>(err);
    } finally {
      setLoading(false);
    }
  };

  return { loginLoading: loading, fetchLogin };
};

export default useLogin;
