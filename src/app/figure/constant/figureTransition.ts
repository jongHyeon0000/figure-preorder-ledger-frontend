import type { FigureStatus, PaymentType } from '@/app/figure/constant/figureStatus';

/** 전이 때 날짜를 보내는 요청 필드 */
type FigureTransitionDateField = 'depositPaidAt' | 'paidAt' | 'deliveredAt';

/** 상태 전이 한 가지 */
export interface FigureTransition {
  /** 지금 상태 */
  from: FigureStatus;

  /** 바꿀 상태 */
  next: FigureStatus;

  /** 요청에 실을 결제 방식. 미구매에서 넘길 때만 있다 */
  paymentType: PaymentType | null;

  /** 날짜를 보내는 요청 필드. 날짜 입력이 없는 전이는 null */
  dateField: FigureTransitionDateField | null;

  /** 날짜 입력칸 이름과 확인창에 쓰는 이름. 날짜 입력이 없으면 빈 문자열 */
  dateLabel: string;

  /** 목록에서 여러 개를 한 번에 바꿀 수 있는지 (예약금은 상품마다 달라 불가) */
  bulk: boolean;
}

/** 허용되는 전이 전부 (장바구니 → 미구매 → (예약완료) → 구매완료 → 배송완료). 같은 상태에서 가는 전이는 앞의 것이 기본 선택이다 */
export const FIGURE_TRANSITIONS: readonly FigureTransition[] = [
  { from: 'CART', next: 'UNPURCHASED', paymentType: null, dateField: null, dateLabel: '', bulk: true },
  { from: 'UNPURCHASED', next: 'RESERVED', paymentType: 'DEPOSIT', dateField: 'depositPaidAt', dateLabel: '예약금 결제일', bulk: false },
  { from: 'UNPURCHASED', next: 'PURCHASED', paymentType: 'FULL', dateField: 'paidAt', dateLabel: '전액 결제일', bulk: true },
  { from: 'RESERVED', next: 'PURCHASED', paymentType: null, dateField: 'paidAt', dateLabel: '잔금 결제일', bulk: true },
  { from: 'PURCHASED', next: 'DELIVERED', paymentType: null, dateField: 'deliveredAt', dateLabel: '도착일', bulk: true },
];
