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

interface FigureTabConfig {
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

/** 처음 열었을 때(새로고침 포함) 선택되는 탭 */
export const DEFAULT_FIGURE_TAB: FigureTabKey = 'ALL';

/** 등록 때 고를 수 있는 상태 (수정에서는 서버가 무시한다) */
export const FIGURE_REGISTER_STATUSES = ['CART', 'UNPURCHASED'] as const;

export type FigureRegisterStatus = (typeof FIGURE_REGISTER_STATUSES)[number];

/** 예약마감일(미구매), 잔금 기한(예약완료)이 이 개월 수(일수÷30) 미만으로 남으면 날짜가 깜빡인다 */
export const DEADLINE_BLINK_MONTHS = 2;

/** 예약마감일(미구매), 잔금 기한(예약완료)이 이 개월 수(일수÷30) 미만으로 남으면 그 탭에 들어갈 때 임박 알림에 뜬다 */
export const DEADLINE_ALERT_MONTHS = 1;

/** 마감 임박 알림(깜빡임, 모달)이 뜨는 탭과 그 문구. 미구매는 예약마감일, 예약완료는 잔금 기한이 기준이다 */
export const URGENT_ALERT = {
  UNPURCHASED: {
    title: '곧 품절될 가능성이 높은 제품이 있어요!',
    subtitle: '예약마감일이 얼마 남지 않은 미구매 항목이에요. 서둘러 확인해보세요.',
  },
  RESERVED: {
    title: '잔금 납부 기한이 다가오고 있어요!',
    subtitle: '잔금 기한이 얼마 남지 않은 예약완료 항목이에요. 잊지 말고 납부해 주세요.',
  },
} as const;

export type UrgentTabKey = keyof typeof URGENT_ALERT;

export const isUrgentTab = (tab: FigureTabKey): tab is UrgentTabKey => tab in URGENT_ALERT;

/** 결제 방식 (FULL 전액, DEPOSIT 예약금+잔금). 미구매에서 다음 상태로 넘길 때 정해지고 이후 바꿀 수 없다 */
export const FIGURE_PAYMENT_TYPES = ['FULL', 'DEPOSIT'] as const;

export type PaymentType = (typeof FIGURE_PAYMENT_TYPES)[number];
