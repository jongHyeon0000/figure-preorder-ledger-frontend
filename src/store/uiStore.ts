import { create } from 'zustand';
import { API_CODE } from '@/config/axios/constant/apiCode';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';

/* 서버 결과 코드에 맞는 스낵바 종류. 성공은 success, 입력을 고치면 되는 문제는 warning, 나머지 실패는 error */
const getSeverity = (code: string): 'success' | 'warning' | 'error' => {
  switch (code) {
    case API_CODE.OK:
      return 'success';
    case API_CODE.VALIDATION_FAILED:
    case API_CODE.DUPLICATE_NAME:
    case API_CODE.DUPLICATE_ACCOUNT:
    case API_CODE.PROTECTED_CATEGORY:
    case API_CODE.LAST_CHILD_CATEGORY:
    case API_CODE.INVALID_STATUS_TRANSITION:
    case API_CODE.BAD_REQUEST:
      return 'warning';
    default:
      return 'error';
  }
};

/**
 * 화면 알림 상태 관리 Store (Zustand)
 * 서버 응답의 결과 알림은 showResult(res), 직접 쓴 글자는 showSnackbar(메시지, 종류)로 호출하고, 그리는 일은 루트의 GlobalSnackbar 가 한다.
 */
interface UiStore {
  /** 스낵바 표시 여부 */
  snackbarOpen: boolean;

  /** 스낵바 메시지 */
  snackbarMessage: string;

  /** 스낵바 종류 */
  snackbarSeverity: 'success' | 'warning' | 'error';

  /** 스낵바 띄우기 */
  showSnackbar: (message: string, severity?: 'success' | 'warning' | 'error') => void;

  /** 서버 응답의 message 를 결과 코드에 맞는 종류로 띄우기 */
  showResult: (res: ApiResponse<unknown>) => void;

  /** 스낵바 닫기 */
  closeSnackbar: () => void;
}

export const useUiStore = create<UiStore>((set, get) => ({
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'success',
  showSnackbar: (message, severity = 'success') =>
    set({ snackbarOpen: true, snackbarMessage: message, snackbarSeverity: severity }),
  showResult: (res) => get().showSnackbar(res.message, getSeverity(res.code)),
  closeSnackbar: () => set({ snackbarOpen: false }),
}));
