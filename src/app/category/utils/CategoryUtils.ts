import {
  CATEGORY_AXES,
  type CategoryAxisKey,
  type CategoryLevel,
  type CategoryLevelConfig,
} from '@/app/category/constant/categoryAxes';
import type { CategoryGroup } from '@/app/category/interface/CategoryGroup';
import type { CategoryItem } from '@/app/category/interface/CategoryItem';
import type { CategorySaveRequestBody } from '@/app/category/interface/CategorySaveRequestBody';

/** 서버가 준 분류 한 건 (축마다 id 필드 이름이 달라서 키로 읽는다) */
export type CategoryRaw = Record<string, unknown>;

/**
 * 축과 단계로 서버 연결 정보를 찾는다. 하위가 없는 축에서 하위를 찾으면 호출한 쪽의 실수라서 에러를 던진다.
 */
export const getLevelConfig = (axis: CategoryAxisKey, level: CategoryLevel): CategoryLevelConfig => {
  const config = CATEGORY_AXES[axis][level];
  if (config === null) throw new Error(`${axis} 축에는 ${level} 단계가 없습니다.`);
  return config;
};

/**
 * 서버 응답 한 건을 공통 모양(CategoryItem)으로 바꾼다.
 * @param idKey 이 단계의 id 필드 이름
 * @param parentIdKey 상위 id 필드 이름. 상위 항목이면 null
 */
export const toCategoryItem = (raw: CategoryRaw, idKey: string, parentIdKey: string | null): CategoryItem => {
  return {
    id: Number(raw[idKey]),
    parentId: parentIdKey === null ? null : Number(raw[parentIdKey]),
    name: typeof raw.name === 'string' ? raw.name : '',
    description: typeof raw.description === 'string' ? raw.description : '',
    thumbnailUrl: typeof raw.thumbnailUrl === 'string' ? raw.thumbnailUrl : null,
  };
};

/**
 * 상위 응답 한 건(하위 중첩 포함)을 공통 모양(CategoryGroup)으로 바꾼다.
 */
export const toCategoryGroup = (raw: CategoryRaw, axis: CategoryAxisKey): CategoryGroup => {
  const { group, child } = CATEGORY_AXES[axis];
  const rawChildren = Array.isArray(raw.children) ? (raw.children as CategoryRaw[]) : [];

  return {
    ...toCategoryItem(raw, group.idKey, null),
    children: child === null ? [] : rawChildren.map((rawChild) => toCategoryItem(rawChild, child.idKey, group.idKey)),
  };
};

/**
 * 추가, 수정 입력을 서버 요청 본문으로 바꾼다.
 * 하위를 추가할 때만 상위 id 를 축마다 다른 필드 이름으로 넣고, 설명이 비어 있으면 필드를 뺀다.
 */
export const toSaveRequest = (
  axis: CategoryAxisKey,
  level: CategoryLevel,
  body: CategorySaveRequestBody,
  parentId?: number,
): Record<string, unknown> => {
  const parentField = level === 'child' && parentId !== undefined ? { [CATEGORY_AXES[axis].group.idKey]: parentId } : {};
  const descriptionField = body.description.trim() === '' ? {} : { description: body.description };

  return { ...parentField, name: body.name.trim(), ...descriptionField };
};
