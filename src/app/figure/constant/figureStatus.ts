/* 상품 상태 (앞으로만 전이한다: 장바구니 → 미구매 → (예약완료) → 구매완료 → 배송완료) */
export const FIGURE_STATUSES = ['CART', 'UNPURCHASED', 'RESERVED', 'PURCHASED', 'DELIVERED'] as const;

export type FigureStatus = (typeof FIGURE_STATUSES)[number];

/** 상태의 한글 이름 */
export const FIGURE_STATUS_LABELS: Record<FigureStatus, string> = {
  CART: '장바구니',
  UNPURCHASED: '미구매',
  RESERVED: '예약완료',
  PURCHASED: '구매완료',
  DELIVERED: '배송완료',
};

/** 목록 탭. 상태 5개와 전체 */
export type FigureTabKey = FigureStatus | 'ALL';

export interface FigureTabConfig {
  key: FigureTabKey;
  label: string;

  /** true 면 오른쪽에 점선을 그어 뒤의 탭들과 구분한다 */
  separated: boolean;
}

/** 탭 순서: 전체를 맨 앞에 두고 점선으로 구분한 뒤, 구매 흐름 순서대로 둔다 */
export const FIGURE_TABS: readonly FigureTabConfig[] = [
  { key: 'ALL', label: '전체', separated: true },
  { key: 'CART', label: FIGURE_STATUS_LABELS.CART, separated: false },
  { key: 'UNPURCHASED', label: FIGURE_STATUS_LABELS.UNPURCHASED, separated: false },
  { key: 'RESERVED', label: FIGURE_STATUS_LABELS.RESERVED, separated: false },
  { key: 'PURCHASED', label: FIGURE_STATUS_LABELS.PURCHASED, separated: false },
  { key: 'DELIVERED', label: FIGURE_STATUS_LABELS.DELIVERED, separated: false },
];

/** 처음 열었을 때 선택되는 탭. 핵심 알림(예약마감 임박)이 미구매에 묶여 있어서 미구매로 둔다 */
export const DEFAULT_FIGURE_TAB: FigureTabKey = 'UNPURCHASED';
