import { useAuthStore } from '@/store/authStore';
import { removeAccessToken } from '@/utils/cookieUtils';

/**
 * 로그아웃 커스텀 훅
 *
 * - 쿠키에서 토큰 삭제
 * - 스토어의 사용자 정보 초기화
 * 서버에는 로그아웃 API가 없어서 클라이언트가 토큰을 버리는 것이 로그아웃이다.
 */
const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    removeAccessToken();
    logout();
  };

  return { logout: handleLogout };
};

export default useLogout;
