import {
  CATEGORY_AXES,
  type CategoryAxisKey,
  type CategoryLevel,
  type CategoryLevelConfig,
} from '@/app/category/constant/categoryAxes';
import type { CategorySaveRequestBody } from '@/app/category/interface/CategorySaveRequestBody';

/**
 * 축과 단계로 서버 연결 정보를 찾는다. 하위가 없는 축(제조사)에서는 하위를 찾지 않는다.
 */
export const getLevelConfig = (axis: CategoryAxisKey, level: CategoryLevel): CategoryLevelConfig => {
  return CATEGORY_AXES[axis][level]!;
};

/**
 * 추가, 수정 입력을 서버 요청 본문으로 바꾼다.
 * 하위를 추가할 때만 상위 id 를 groupId 로 넣고, 설명이 비어 있으면 필드를 뺀다.
 */
export const toSaveRequest = (
  level: CategoryLevel,
  body: CategorySaveRequestBody,
  parentId?: number,
): Record<string, unknown> => {
  const parentField = level === 'child' && parentId !== undefined ? { groupId: parentId } : {};
  const descriptionField = body.description.trim() === '' ? {} : { description: body.description };

  return { ...parentField, name: body.name.trim(), ...descriptionField };
};
