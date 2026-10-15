import type { FigureRegisterStatus } from '@/app/figure/constant/figureStatus';

/** 상품 등록, 수정 요청 본문 (POST /api/figure, PUT /api/figure/{figureId}) */
export interface FigureSaveRequestBody {
  /** 등록 상태. 수정에서는 서버가 무시한다 */
  status: FigureRegisterStatus;

  /** 상품명 (255자 이하) */
  name: string;

  /** 배송예정월 ("YYYY-MM-01"). 비우면 보내지 않는다 */
  deliveryMonth?: string;

  /** 예약마감일 ("YYYY-MM-DD"). 비우면 보내지 않는다 */
  reservationDeadline?: string;

  /** 개당 가격(원, 0 이상) */
  price: number;

  /** 수량 (1 이상) */
  quantity: number;

  /** 형태 하위 id */
  figureTypeId: number;

  /** 판매처 하위 id */
  shopId: number;

  /** 제조사 id */
  makerId: number;

  /** 구매 링크 (2000자 이하). 비우면 보내지 않는다 */
  purchaseLink?: string;

  /** 설명 HTML. 에디터가 생기기 전에는 기존 값을 그대로 돌려보낸다 */
  description?: string;

  /** 시리즈 id 목록 (1개 이상) */
  seriesIds: number[];

  /** 캐릭터 id 목록 (1개 이상) */
  characterIds: number[];
}
