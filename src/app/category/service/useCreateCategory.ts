import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { CategoryAxisKey, CategoryLevel } from '@/app/category/constant/categoryAxes';
import type { CategoryItem } from '@/app/category/interface/CategoryItem';
import type { CategorySaveRequestBody } from '@/app/category/interface/CategorySaveRequestBody';
import { getLevelConfig, toSaveRequest } from '@/app/category/utils/CategoryUtils';

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
      const res = await api.post<ApiResponse<CategoryItem | null>>(
        levelConfig.path,
        toSaveRequest(level, body, parentId),
      );
      return res.data;
    } catch (err) {
      return toApiResponse<CategoryItem>(err);
    } finally {
      setLoading(false);
    }
  };

  return { createCategoryLoading: loading, fetchCreateCategory };
};

export default useCreateCategory;
