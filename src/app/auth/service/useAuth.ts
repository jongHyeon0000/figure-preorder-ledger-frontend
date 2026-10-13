import { useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getAccessToken } from '@/utils/cookieUtils';
import useLogout from '@/app/auth/service/useLogout';

/**
 * 통합 인증 훅
 *
 * - isAuthenticated 는 쿠키 토큰이 있고 user 도 있어야 true (쿠키가 만료되면 user 도 함께 비워진다)
 * - 로그인 함수는 로그인 화면을 만드는 단계에서 이 훅에 추가한다
 */
const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogout();

  /* user 가 바뀔 때 다시 계산한다 (로그인, 로그아웃, 401/403 처리 모두 user 를 바꾼다) */
  const isAuthenticated = useMemo(() => getAccessToken() !== undefined && user !== null, [user]);

  return {
    /** 현재 로그인한 사용자 정보 (null이면 미인증) */
    user,
    /** 인증 여부 (쿠키 토큰 + user) */
    isAuthenticated,
    /** 로그아웃 함수 */
    logout,
  };
};

export default useAuth;
