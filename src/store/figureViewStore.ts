import { create } from 'zustand';
import { EMPTY_FIGURE_FILTERS } from '@/app/figure/constant/figureFilter';
import { DEFAULT_FIGURE_SORT, type FigureSortKey } from '@/app/figure/constant/figureSortOptions';
import { DEFAULT_FIGURE_TAB, type FigureTabKey } from '@/app/figure/constant/figureStatus';
import type { FigureFilterValue } from '@/app/figure/interface/FigureFilterValue';
import type { FigureFilterKey, FigureFilters } from '@/app/figure/interface/FigureFilters';

/**
 * 상품 목록 조건 Store (Zustand)
 * 탭, 필터, 정렬을 담아서 상세에 갔다 와도 목록 조건이 유지된다(새로고침하면 초기화).
 */
interface FigureViewStore {
  /** 선택한 상태 탭 */
  tab: FigureTabKey;

  /** 분류 필터 */
  filters: FigureFilters;

  /** 배송월 필터 ("YYYY-MM"). 고르지 않았으면 null */
  month: string | null;

  /** 정렬 */
  sort: FigureSortKey;

  setTab: (tab: FigureTabKey) => void;
  setFilter: (key: FigureFilterKey, value: FigureFilterValue | null) => void;
  setMonth: (month: string | null) => void;
  setSort: (sort: FigureSortKey) => void;

  /** 분류 필터와 배송월을 비운다 (탭과 정렬은 그대로) */
  resetFilters: () => void;
}

export const useFigureViewStore = create<FigureViewStore>((set) => ({
  tab: DEFAULT_FIGURE_TAB,
  filters: EMPTY_FIGURE_FILTERS,
  month: null,
  sort: DEFAULT_FIGURE_SORT,
  setTab: (tab) => set({ tab }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  setMonth: (month) => set({ month }),
  setSort: (sort) => set({ sort }),
  resetFilters: () => set({ filters: EMPTY_FIGURE_FILTERS, month: null }),
}));
