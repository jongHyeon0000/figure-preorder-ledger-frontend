import type { FigureSortKey } from '@/app/figure/constant/figureSortOptions';
import type { FigureTabKey } from '@/app/figure/constant/figureStatus';
import { FIGURE_TABS } from '@/app/figure/constant/figureStatus';
import type { FigureCategoryRef } from '@/app/figure/interface/FigureCategoryRef';
import type { FigureFilterOptionGroup } from '@/app/figure/interface/FigureFilterOptionGroup';
import type { FigureFilterOptionItem } from '@/app/figure/interface/FigureFilterOptionItem';
import type { FigureFilterOptions } from '@/app/figure/interface/FigureFilterOptions';
import type { FigureFilterValue } from '@/app/figure/interface/FigureFilterValue';
import type { FigureFilters } from '@/app/figure/interface/FigureFilters';
import type { FigureSummary } from '@/app/figure/interface/FigureSummary';

/**
 * 상품 목록 계산 모음 (탭, 필터, 정렬, 합계). 서버는 전체를 한 번에 주므로 모두 화면에서 한다.
 */

/** 탭마다 상품 수 (전체 포함) */
export const countByTab = (figures: FigureSummary[]): Record<FigureTabKey, number> => {
  const counts = Object.fromEntries(FIGURE_TABS.map((tab) => [tab.key, 0])) as Record<FigureTabKey, number>;
  counts.ALL = figures.length;
  figures.forEach((figure) => {
    counts[figure.status] += 1;
  });
  return counts;
};

/** 탭에 해당하는 상품만 */
export const filterByTab = (figures: FigureSummary[], tab: FigureTabKey): FigureSummary[] => {
  return tab === 'ALL' ? figures : figures.filter((figure) => figure.status === tab);
};

/** 배송예정월("YYYY-MM-DD")을 필터에 쓰는 "YYYY-MM"으로 */
export const toMonthKey = (deliveryMonth: string): string => deliveryMonth.slice(0, 7);

/** 배송예정월 표시 (예: "2027-02-01" 또는 "2027-02" -> "2027.02") */
export const formatDeliveryMonth = (deliveryMonth: string): string => {
  return toMonthKey(deliveryMonth).replace('-', '.');
};

/** 마감일 표시 (예: "2026-12-15" -> "26.12.15") */
export const formatDeadline = (date: string): string => date.slice(2, 10).replaceAll('-', '.');

/* 같은 상위끼리 묶어서 상위 목록과 하위 목록을 만든다. 이름은 가나다순 */
const collectGroups = (refs: FigureCategoryRef[]): FigureFilterOptionGroup[] => {
  const groups = new Map<number, FigureFilterOptionGroup>();

  refs.forEach((ref) => {
    if (ref.groupId === null) return;
    const group = groups.get(ref.groupId) ?? { groupId: ref.groupId, groupName: ref.groupName, items: [] };
    if (!group.items.some((item) => item.id === ref.id)) group.items.push({ id: ref.id, name: ref.name });
    groups.set(ref.groupId, group);
  });

  return [...groups.values()]
    .map((group) => ({ ...group, items: [...group.items].sort((a, b) => a.name.localeCompare(b.name, 'ko')) }))
    .sort((a, b) => a.groupName.localeCompare(b.groupName, 'ko'));
};

const collectItems = (refs: FigureCategoryRef[]): FigureFilterOptionItem[] => {
  const items = new Map<number, FigureFilterOptionItem>();
  refs.forEach((ref) => items.set(ref.id, { id: ref.id, name: ref.name }));
  return [...items.values()].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
};

const notNull = <T>(value: T | null): value is T => value !== null;

/** 지금 탭의 상품에 쓰인 분류만 모아 필터 선택지를 만든다 */
export const buildFilterOptions = (figures: FigureSummary[]): FigureFilterOptions => {
  return {
    figureType: collectGroups(figures.map((figure) => figure.figureType).filter(notNull)),
    shop: collectGroups(figures.map((figure) => figure.shop).filter(notNull)),
    series: collectGroups(figures.flatMap((figure) => figure.series)),
    character: collectGroups(figures.flatMap((figure) => figure.characters)),
    maker: collectItems(figures.map((figure) => figure.maker).filter(notNull)),
    months: [...new Set(figures.map((figure) => toMonthKey(figure.deliveryMonth)).filter((month) => month !== ''))].sort(),
  };
};

/* 고른 값이 지금 선택지에 있는지 */
const isGroupValueValid = (value: FigureFilterValue, groups: FigureFilterOptionGroup[]): boolean => {
  if (value.itemId !== null) return groups.some((group) => group.items.some((item) => item.id === value.itemId));
  return groups.some((group) => group.groupId === value.groupId);
};

const isItemValueValid = (value: FigureFilterValue, items: FigureFilterOptionItem[]): boolean => {
  return items.some((item) => item.id === value.itemId);
};

/**
 * 탭을 바꿔서 선택지에 없어진 값은 걸러 낸다(저장된 값은 그대로 두고 적용에서만 뺀다).
 */
export const pruneFilters = (
  filters: FigureFilters,
  month: string | null,
  options: FigureFilterOptions,
): { filters: FigureFilters; month: string | null } => {
  const keep = (value: FigureFilterValue | null, valid: (value: FigureFilterValue) => boolean) =>
    value !== null && valid(value) ? value : null;

  return {
    filters: {
      figureType: keep(filters.figureType, (value) => isGroupValueValid(value, options.figureType)),
      shop: keep(filters.shop, (value) => isGroupValueValid(value, options.shop)),
      series: keep(filters.series, (value) => isGroupValueValid(value, options.series)),
      character: keep(filters.character, (value) => isGroupValueValid(value, options.character)),
      maker: keep(filters.maker, (value) => isItemValueValid(value, options.maker)),
    },
    month: month !== null && options.months.includes(month) ? month : null,
  };
};

/* 상위만 골랐으면 그 상위에 속하는지, 하위를 골랐으면 그 하위인지 */
const matchesRef = (ref: FigureCategoryRef | null, value: FigureFilterValue): boolean => {
  if (ref === null) return false;
  return value.itemId !== null ? ref.id === value.itemId : ref.groupId === value.groupId;
};

/** 고른 필터와 배송월에 맞는 상품만 (시리즈와 캐릭터는 하나라도 맞으면 보인다) */
export const applyFilters = (figures: FigureSummary[], filters: FigureFilters, month: string | null): FigureSummary[] => {
  return figures.filter((figure) => {
    if (filters.figureType !== null && !matchesRef(figure.figureType, filters.figureType)) return false;
    if (filters.shop !== null && !matchesRef(figure.shop, filters.shop)) return false;
    if (filters.maker !== null && !matchesRef(figure.maker, filters.maker)) return false;
    if (filters.series !== null && !figure.series.some((ref) => matchesRef(ref, filters.series as FigureFilterValue))) return false;
    if (filters.character !== null && !figure.characters.some((ref) => matchesRef(ref, filters.character as FigureFilterValue)))
      return false;
    if (month !== null && toMonthKey(figure.deliveryMonth) !== month) return false;
    return true;
  });
};

/** 총액 (개당 가격 × 수량) */
export const getTotalPrice = (figure: FigureSummary): number => figure.price * figure.quantity;

/**
 * 지금까지 낸 금액: 예약완료는 예약금, 구매완료와 배송완료는 총액.
 * 장바구니와 미구매는 아직 내지 않았으므로 0
 */
export const getPaidAmount = (figure: FigureSummary): number => {
  if (figure.status === 'RESERVED') return figure.depositAmount ?? 0;
  if (figure.status === 'PURCHASED' || figure.status === 'DELIVERED') return getTotalPrice(figure);
  return 0;
};

export const sumTotalPrice = (figures: FigureSummary[]): number => {
  return figures.reduce((sum, figure) => sum + getTotalPrice(figure), 0);
};

export const sumPaidAmount = (figures: FigureSummary[]): number => {
  return figures.reduce((sum, figure) => sum + getPaidAmount(figure), 0);
};

const NO_DATE = '9999-99-99';

/** 정렬한 새 목록 */
export const sortFigures = (figures: FigureSummary[], sort: FigureSortKey): FigureSummary[] => {
  const sorted = [...figures];

  switch (sort) {
    case 'PRICE_ASC':
      return sorted.sort((a, b) => getTotalPrice(a) - getTotalPrice(b));
    case 'PRICE_DESC':
      return sorted.sort((a, b) => getTotalPrice(b) - getTotalPrice(a));
    case 'MONTH_ASC':
      return sorted.sort((a, b) => a.deliveryMonth.localeCompare(b.deliveryMonth));
    case 'DEADLINE_ASC':
      return sorted.sort((a, b) => (a.reservationDeadline || NO_DATE).localeCompare(b.reservationDeadline || NO_DATE));
  }
};

/** 예약마감일이 지났는지 (구매 전인 장바구니와 미구매만 해당) */
export const isDeadlinePassed = (figure: FigureSummary, today: string): boolean => {
  const beforePurchase = figure.status === 'CART' || figure.status === 'UNPURCHASED';
  return beforePurchase && figure.reservationDeadline !== '' && figure.reservationDeadline < today;
};
