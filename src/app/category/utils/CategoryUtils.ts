import {
  CATEGORY_AXES,
  type CategoryAxisKey,
  type CategoryLevel,
  type CategoryLevelConfig,
} from '@/app/category/constant/categoryAxes';
import type { CategorySaveRequestBody } from '@/app/category/interface/CategorySaveRequestBody';

/**
 * 축과 단계로 서버 연결 정보를 찾는다. 하위가 없는 축에서 하위를 찾으면 호출한 쪽의 실수라서 에러를 던진다.
 */
export const getLevelConfig = (axis: CategoryAxisKey, level: CategoryLevel): CategoryLevelConfig => {
  const config = CATEGORY_AXES[axis][level];
  if (config === null) throw new Error(`${axis} 축에는 ${level} 단계가 없습니다.`);
  return config;
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
