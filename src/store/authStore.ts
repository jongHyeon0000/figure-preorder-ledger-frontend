import { create } from 'zustand';
import type { UserInfo } from '@/app/auth/interface/UserInfo';

/**
 * 인증 상태 관리 Store (Zustand)
 * 토큰은 여기에 두지 않고 쿠키(cookieUtils)에만 둔다.
 */
interface AuthStore {
  /** 현재 로그인한 사용자 정보 (null이면 미인증) */
  user: UserInfo | null;

  /** 앱 초기화 완료 여부 (쿠키 토큰 -> /api/auth/me 확인이 끝나면 true) */
  isInitialized: boolean;

  /** 사용자 정보 설정 (로그인, 앱 시작 시 호출) */
  setUser: (user: UserInfo | null) => void;

  /** 앱 초기화 완료 처리 */
  setInitialized: () => void;

  /** 로그아웃 (사용자 정보 초기화) */
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => set({ user }),
  setInitialized: () => set({ isInitialized: true }),
  logout: () => set({ user: null }),
}));
