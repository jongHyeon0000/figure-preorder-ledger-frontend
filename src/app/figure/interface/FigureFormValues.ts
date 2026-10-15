import type { Dayjs } from 'dayjs';
import type { FigureRegisterStatus } from '@/app/figure/constant/figureStatus';

/**
 * 상품 폼에 입력하는 값. 서버 요청과 다른 점: 날짜는 Dayjs, 가격과 수량은 입력 글자,
 * 장르(캐릭터의 상위)는 화면에서만 쓰고 서버에는 보내지 않는다.
 */
export interface FigureFormValues {
  /** 등록 상태 */
  status: FigureRegisterStatus;

  /** 상품명 */
  name: string;

  /** 배송예정월 (비어 있으면 null) */
  deliveryMonth: Dayjs | null;

  /** 예약마감일 (비어 있으면 null) */
  reservationDeadline: Dayjs | null;

  /** 개당 가격 입력 글자 */
  price: string;

  /** 수량 입력 글자 */
  quantity: string;

  /** 구매 링크 */
  purchaseLink: string;

  /** 장르 id (캐릭터를 고르는 범위를 정한다) */
  genreId: number | null;

  /** 캐릭터 id 목록 */
  characterIds: number[];

  /** 형태 하위 id */
  figureTypeId: number | null;

  /** 판매처 하위 id */
  shopId: number | null;

  /** 제조사 id */
  makerId: number | null;

  /** 시리즈 id 목록 */
  seriesIds: number[];

  /** 설명 HTML (에디터 전까지는 화면에서 고치지 않는다) */
  description: string;
}
