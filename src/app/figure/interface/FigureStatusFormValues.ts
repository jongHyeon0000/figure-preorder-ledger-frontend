import type { Dayjs } from 'dayjs';
import type { FigureStatus } from '@/app/figure/constant/figureStatus';

/** 상태 변경 창의 입력값 (화면에서만 쓰고 FigureStatusRequestBody 로 바꿔 보낸다) */
export interface FigureStatusFormValues {
  /** 바꿀 상태 */
  nextStatus: FigureStatus;

  /** 예약금 (예약완료로 바꿀 때만 쓴다) */
  depositAmount: string;

  /** 날짜 (예약금 결제일, 결제일, 도착일 중 그 전이에서 쓰는 하나) */
  date: Dayjs | null;

  /** 잔금 기한 (예약완료로 바꿀 때만, 선택) */
  balanceDueDate: Dayjs | null;

  /** 예약금의 상한인 상품 총액(원). 화면에서 검증할 때만 쓴다(일괄은 0) */
  totalPrice: number;
}
