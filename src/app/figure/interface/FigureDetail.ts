import type { FigureSummary } from '@/app/figure/interface/FigureSummary';

/** 상품 상세. 목록 항목에 설명과 결제, 기록 일자를 더한 것 */
export interface FigureDetail extends FigureSummary {
  /** 설명 (에디터 HTML). 비어 있으면 필드가 없다 */
  description?: string;

  /** 예약금 결제일 ("YYYY-MM-DD") */
  depositPaidAt: string | null;

  /** 전액 결제일 ("YYYY-MM-DD") */
  paidAt: string | null;

  /** 배송완료일 ("YYYY-MM-DD") */
  deliveredAt: string | null;

  /** 등록일시 ("YYYY-MM-DDTHH:mm:ss") */
  createdAt: string;

  /** 수정일시 ("YYYY-MM-DDTHH:mm:ss") */
  updatedAt: string;
}
