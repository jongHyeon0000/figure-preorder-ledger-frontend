import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import { API_CODE } from '@/config/axios/constant/apiCode';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import { useAuthStore } from '@/store/authStore';
import type { UserInfo } from '@/app/auth/interface/UserInfo';

/**
 * 내 정보 조회 훅 (GET /api/auth/me)
 * 성공하면 authStore 의 user 를 이 값으로 바꾼다. 앱 시작, 로그인, 프로필 이미지 변경 뒤에 같이 쓴다.
 */
const useReadMe = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const setUser = useAuthStore((state) => state.setUser);

  const fetchReadMe = async (): Promise<ApiResponse<UserInfo | null>> => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<UserInfo>>('/api/auth/me');
      if (res.data.code === API_CODE.OK) setUser(res.data.data);
      return res.data;
    } catch (err) {
      return toApiResponse<UserInfo>(err);
    } finally {
      setLoading(false);
    }
  };

  return { meLoading: loading, fetchReadMe };
};

export default useReadMe;
