import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import { CATEGORY_AXES, type CategoryAxisKey, type CategoryLevel } from '@/app/category/constant/categoryAxes';
import type { CategoryItem } from '@/app/category/interface/CategoryItem';
import type { CategorySaveRequestBody } from '@/app/category/interface/CategorySaveRequestBody';
import { getLevelConfig, toCategoryItem, toSaveRequest, type CategoryRaw } from '@/app/category/utils/CategoryUtils';

/**
 * 분류 추가 훅 (5개 축, 상위/하위 공용)
 * 이름이 중복이면 서버가 400을 준다. 상위를 추가하면 서버가 기본 하위 '기타'를 같이 만든다.
 */
const useCreateCategory = () => {
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * @param parentId 하위를 추가할 때 속할 상위 id
   */
  const fetchCreateCategory = async (
    axis: CategoryAxisKey,
    level: CategoryLevel,
    body: CategorySaveRequestBody,
    parentId?: number,
  ): Promise<ApiResponse<CategoryItem | null>> => {
    const levelConfig = getLevelConfig(axis, level);

    setLoading(true);
    try {
      const res = await api.post<ApiResponse<CategoryRaw | null>>(
        levelConfig.path,
        toSaveRequest(axis, level, body, parentId),
      );
      const parentIdKey = level === 'child' ? CATEGORY_AXES[axis].group.idKey : null;
      const created = res.data.data === null ? null : toCategoryItem(res.data.data, levelConfig.idKey, parentIdKey);

      return { ...res.data, data: created };
    } catch (err) {
      return toApiResponse<CategoryItem>(err);
    } finally {
      setLoading(false);
    }
  };

  return { createCategoryLoading: loading, fetchCreateCategory };
};

export default useCreateCategory;
