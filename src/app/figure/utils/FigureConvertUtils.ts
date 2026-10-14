import type { FigureStatus } from '@/app/figure/constant/figureStatus';
import type { PaymentType } from '@/app/figure/constant/paymentType';
import type { FigureCategoryRef } from '@/app/figure/interface/FigureCategoryRef';
import type { FigureSummary } from '@/app/figure/interface/FigureSummary';

/** 서버가 준 상품 한 건 (분류마다 id 필드 이름이 달라서 키로 읽는다) */
export type FigureRaw = Record<string, unknown>;

/**
 * 서버가 준 분류 한 건을 공통 모양으로 바꾼다.
 * @param groupIdKey 상위 id 필드 이름. 상위가 없는 분류(제조사)는 null
 * @param groupNameKey 상위 이름 필드 이름. 상위가 없는 분류는 null
 */
const toCategoryRef = (
  raw: unknown,
  idKey: string,
  groupIdKey: string | null,
  groupNameKey: string | null,
): FigureCategoryRef | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const item = raw as Record<string, unknown>;

  return {
    id: Number(item[idKey]),
    groupId: groupIdKey === null ? null : Number(item[groupIdKey]),
    name: String(item.name ?? ''),
    groupName: groupNameKey === null ? '' : String(item[groupNameKey] ?? ''),
  };
};

const toCategoryRefList = (
  raw: unknown,
  idKey: string,
  groupIdKey: string,
  groupNameKey: string,
): FigureCategoryRef[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => toCategoryRef(item, idKey, groupIdKey, groupNameKey))
    .filter((ref): ref is FigureCategoryRef => ref !== null);
};

/**
 * 서버 응답 한 건을 목록용 상품(FigureSummary)으로 바꾼다.
 */
export const toFigureSummary = (raw: FigureRaw): FigureSummary => {
  return {
    id: Number(raw.figureId),
    status: raw.status as FigureStatus,
    paymentType: raw.paymentType == null ? null : (raw.paymentType as PaymentType),
    name: String(raw.name ?? ''),
    deliveryMonth: String(raw.deliveryMonth ?? ''),
    reservationDeadline: String(raw.reservationDeadline ?? ''),
    price: Number(raw.price ?? 0),
    quantity: Number(raw.quantity ?? 1),
    depositAmount: raw.depositAmount == null ? null : Number(raw.depositAmount),
    balanceDueDate: raw.balanceDueDate == null ? null : String(raw.balanceDueDate),
    thumbnailUrl: raw.thumbnailUrl == null ? null : String(raw.thumbnailUrl),
    purchaseLink: String(raw.purchaseLink ?? ''),
    figureType: toCategoryRef(raw.figureType, 'figureTypeId', 'figureTypeGroupId', 'figureTypeGroupName'),
    shop: toCategoryRef(raw.shop, 'shopId', 'shopGroupId', 'shopGroupName'),
    maker: toCategoryRef(raw.maker, 'makerId', null, null),
    series: toCategoryRefList(raw.series, 'seriesId', 'seriesGroupId', 'seriesGroupName'),
    characters: toCategoryRefList(raw.characters, 'genreCharacterId', 'genreCharacterGroupId', 'genreCharacterGroupName'),
  };
};
