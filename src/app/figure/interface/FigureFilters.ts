import type { FigureFilterValue } from '@/app/figure/interface/FigureFilterValue';

/** 분류 필터 종류 */
export type FigureFilterKey = 'figureType' | 'shop' | 'maker' | 'series' | 'character';

/** 분류 필터마다 고른 값. 고르지 않았으면 null */
export type FigureFilters = Record<FigureFilterKey, FigureFilterValue | null>;
