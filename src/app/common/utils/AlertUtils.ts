import Swal from 'sweetalert2';
import theme from '@/config/theme/theme';

/** 확인창 옵션 */
interface ConfirmOptions {
  /** 제목 */
  title: string;

  /** 본문 (일반 글자) */
  text?: string;

  /** 본문 (HTML). 사용자 입력을 넣을 때는 escapeHtml 로 감싼다 */
  html?: string;

  /** 확인 버튼 글자 */
  confirmText?: string;

  /** 취소 버튼 글자 */
  cancelText?: string;

  /** true 면 확인 버튼을 경고색으로 (삭제, 탈퇴) */
  danger?: boolean;

  /** true 면 취소 버튼이 먼저 선택되어 있다 (실수로 Enter 를 눌러도 진행되지 않게) */
  focusCancel?: boolean;
}

/**
 * 확인창 (sweetalert2). 되돌릴 수 없는 동작을 하기 전에 띄운다.
 * 색, 글꼴은 테마에서 가져와 MUI 모달과 같은 분위기를 낸다.
 *
 * @returns 확인을 눌렀으면 true, 취소나 바깥 클릭이면 false
 */
export const showConfirmAlert = async ({
  title,
  text,
  html,
  confirmText = '확인',
  cancelText = '취소',
  danger = false,
  focusCancel = false,
}: ConfirmOptions): Promise<boolean> => {
  const { palette } = theme;
  const confirmColor = danger ? palette.error : palette.primary;

  const result = await Swal.fire({
    icon: danger ? 'warning' : 'question',
    iconColor: confirmColor.main,
    title,
    text,
    html,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    focusCancel,
    background: palette.background.paper,
    color: palette.text.primary,
    confirmButtonColor: confirmColor.main,
    cancelButtonColor: palette.surfaceRaised,
    didOpen: (popup) => {
      popup.style.borderRadius = `${theme.spacing(2)}`;
      popup.style.border = `1px solid ${palette.divider}`;

      const confirmButton = Swal.getConfirmButton();
      if (confirmButton) confirmButton.style.color = confirmColor.contrastText;

      const cancelButton = Swal.getCancelButton();
      if (cancelButton) cancelButton.style.color = palette.text.primary;
    },
  });

  return result.isConfirmed;
};
