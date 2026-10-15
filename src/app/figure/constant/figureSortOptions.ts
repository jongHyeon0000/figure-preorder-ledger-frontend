/** 정렬 종류 */
export type FigureSortKey = 'DEADLINE_ASC' | 'PRICE_ASC' | 'PRICE_DESC' | 'MONTH_ASC';

interface FigureSortOption {
  key: FigureSortKey;
  label: string;
}

/** 정렬 4종 (첫 번째가 기본) */
export const FIGURE_SORT_OPTIONS: readonly FigureSortOption[] = [
  { key: 'DEADLINE_ASC', label: '예약 빠른순' },
  { key: 'PRICE_ASC', label: '가격 낮은순' },
  { key: 'PRICE_DESC', label: '가격 높은순' },
  { key: 'MONTH_ASC', label: '배송 빠른순' },
];

export const DEFAULT_FIGURE_SORT: FigureSortKey = 'DEADLINE_ASC';
