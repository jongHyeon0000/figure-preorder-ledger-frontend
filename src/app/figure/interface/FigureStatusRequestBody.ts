import type { FigureStatus, PaymentType } from '@/app/figure/constant/figureStatus';

/** 상태 전이 요청 본문 (개별, 일괄). 날짜를 생략하면 서버가 오늘 날짜를 쓴다 */
export interface FigureStatusRequestBody {
  /** 바꿀 상태 */
  status: FigureStatus;

  /** 결제 방식. 미구매에서 넘길 때만 보낸다 */
  paymentType?: PaymentType;

  /** 예약금 총액(원). 예약완료로 넘길 때 필수 */
  depositAmount?: number;

  /** 예약금 결제일 ("YYYY-MM-DD") */
  depositPaidAt?: string;

  /** 잔금 기한 ("YYYY-MM-DD"). 예약완료로 넘길 때만, 선택 */
  balanceDueDate?: string;

  /** 전액 결제일, 잔금 결제일 ("YYYY-MM-DD") */
  paidAt?: string;

  /** 배송완료일 ("YYYY-MM-DD") */
  deliveredAt?: string;

  /** 일괄 전이 대상 상품 id. 일괄 전이에서만 보낸다 */
  figureIds?: number[];
}
