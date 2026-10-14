import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { SignupRequestBody } from '@/app/auth/interface/SignupRequestBody';
import type { UserInfo } from '@/app/auth/interface/UserInfo';

/**
 * 회원가입 훅
 * 가입만 하고 로그인은 하지 않는다. 아이디나 이메일이 중복이면 서버가 400을 준다.
 */
const useSignup = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSignup = async (body: SignupRequestBody): Promise<ApiResponse<UserInfo | null>> => {
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<UserInfo>>('/api/auth/signup', body);
      return res.data;
    } catch (err) {
      return toApiResponse<UserInfo>(err);
    } finally {
      setLoading(false);
    }
  };

  return { signupLoading: loading, fetchSignup };
};

export default useSignup;
