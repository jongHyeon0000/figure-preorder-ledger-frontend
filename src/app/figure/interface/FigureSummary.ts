import type { FigureStatus } from '@/app/figure/constant/figureStatus';
import type { PaymentType } from '@/app/figure/constant/paymentType';
import type { FigureCategoryRef } from '@/app/figure/interface/FigureCategoryRef';

/** 상품 목록의 한 건 (설명 HTML은 상세에서만 받는다) */
export interface FigureSummary {
  /** 상품 id */
  id: number;

  /** 상태 */
  status: FigureStatus;

  /** 결제 방식. 미구매 이전에는 null */
  paymentType: PaymentType | null;

  /** 상품명 */
  name: string;

  /** 배송예정월 ("YYYY-MM-DD", 해당 월 1일) */
  deliveryMonth: string;

  /** 예약마감일 ("YYYY-MM-DD") */
  reservationDeadline: string;

  /** 개당 가격(원). 총액은 price × quantity */
  price: number;

  /** 수량 */
  quantity: number;

  /** 결제한 예약금 총액(원). 예약금형만 */
  depositAmount: number | null;

  /** 잔금 기한 ("YYYY-MM-DD"). 예약금형만, 비어 있을 수 있다 */
  balanceDueDate: string | null;

  /** 썸네일 주소 ('/uploads/...'). 없으면 null */
  thumbnailUrl: string | null;

  /** 구매 링크 */
  purchaseLink: string;

  /** 형태 */
  figureType: FigureCategoryRef | null;

  /** 판매처 */
  shop: FigureCategoryRef | null;

  /** 제조사 */
  maker: FigureCategoryRef | null;

  /** 시리즈 (여러 개) */
  series: FigureCategoryRef[];

  /** 캐릭터 (여러 개) */
  characters: FigureCategoryRef[];
}
