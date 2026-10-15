import type { FigureFilterKey, FigureFilters } from '@/app/figure/interface/FigureFilters';

/** 아무것도 고르지 않은 분류 필터 */
export const EMPTY_FIGURE_FILTERS: FigureFilters = {
  figureType: null,
  shop: null,
  maker: null,
  series: null,
  character: null,
};

/** 분류 필터 종류와 보여 주는 순서 (필터 줄의 칸 순서와 같다) */
export const FIGURE_FILTER_KEYS: readonly FigureFilterKey[] = ['figureType', 'shop', 'maker', 'series', 'character'];

/** 분류 필터의 이름 */
export const FIGURE_FILTER_LABELS: Record<FigureFilterKey, string> = {
  figureType: '형태',
  shop: '판매처',
  maker: '제조사',
  series: '시리즈',
  character: '장르·캐릭터',
};
