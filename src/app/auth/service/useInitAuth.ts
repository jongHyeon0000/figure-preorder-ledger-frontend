import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getAccessToken } from '@/utils/cookieUtils';
import useReadMe from '@/app/auth/service/useReadMe';

/**
 * 앱을 켤 때 쿠키 토큰으로 로그인 상태를 복원하는 훅
 *
 * - 쿠키에 토큰이 있으면 GET /api/auth/me 를 호출하고, 성공하면 user 를 채운다
 * - 쿠키에 토큰이 없으면 서버를 부르지 않고 바로 초기화를 끝낸다
 * - 토큰이 무효하면 AxiosConfig 의 인터셉터가 쿠키와 스토어를 비운다
 */
const useInitAuth = () => {
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const { fetchReadMe } = useReadMe();

  useEffect(() => {
    if (!getAccessToken()) {
      setInitialized();
      return;
    }

    fetchReadMe().finally(setInitialized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useInitAuth;
