import { useEffect } from 'react';
import { API_CODE } from '@/config/axios/constant/apiCode';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { useAuthStore } from '@/store/authStore';
import { getAccessToken } from '@/utils/cookieUtils';
import type { UserInfo } from '@/app/auth/interface/UserInfo';

/**
 * 앱을 켤 때 쿠키 토큰으로 로그인 상태를 복원하는 훅
 *
 * - 쿠키에 토큰이 있으면 GET /api/auth/me 를 호출하고, 성공하면 user 를 채운다
 * - 쿠키에 토큰이 없으면 서버를 부르지 않고 바로 초기화를 끝낸다
 */
const useInitAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    if (!getAccessToken()) {
      setInitialized();
      return;
    }

    api
      .get<ApiResponse<UserInfo>>('/api/auth/me')
      .then((response) => {
        if (response.data.code === API_CODE.OK) {
          setUser(response.data.data);
        }
      })
      .catch(() => {
        /* 토큰이 무효하면 AxiosConfig 의 인터셉터가 쿠키와 스토어를 비운다 */
      })
      .finally(() => {
        setInitialized();
      });
  }, [setUser, setInitialized]);
};

export default useInitAuth;
