import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { WithdrawRequestBody } from '@/app/auth/interface/WithdrawRequestBody';

/**
 * 회원 탈퇴 훅 (DELETE /api/auth/me)
 * 비밀번호가 틀리면 서버가 400을 준다(로그인 상태라서 401이 아니다). 성공해도 data 가 없고 되돌릴 수 없다.
 * 성공 뒤의 로그아웃과 이동은 페이지가 한다.
 */
const useWithdraw = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWithdraw = async (body: WithdrawRequestBody): Promise<ApiResponse<null>> => {
    setLoading(true);
    try {
      const res = await api.delete<ApiResponse<null>>('/api/auth/me', { data: body });
      return res.data;
    } catch (err) {
      return toApiResponse<null>(err);
    } finally {
      setLoading(false);
    }
  };

  return { withdrawLoading: loading, fetchWithdraw };
};

export default useWithdraw;
