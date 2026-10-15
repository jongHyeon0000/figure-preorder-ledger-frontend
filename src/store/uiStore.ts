import { create } from 'zustand';

/**
 * 화면 알림 상태 관리 Store (Zustand)
 * 페이지는 showSnackbar(메시지, 종류)만 호출하고, 그리는 일은 루트의 GlobalSnackbar 가 한다.
 */
interface UiStore {
  /** 스낵바 표시 여부 */
  snackbarOpen: boolean;

  /** 스낵바 메시지 */
  snackbarMessage: string;

  /** 스낵바 종류 */
  snackbarSeverity: 'success' | 'error' | 'warning' | 'info';

  /** 스낵바 띄우기 */
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'warning' | 'info') => void;

  /** 스낵바 닫기 */
  closeSnackbar: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'success',
  showSnackbar: (message, severity = 'success') =>
    set({ snackbarOpen: true, snackbarMessage: message, snackbarSeverity: severity }),
  closeSnackbar: () => set({ snackbarOpen: false }),
}));
