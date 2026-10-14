import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { CategoryAxisKey, CategoryLevel } from '@/app/category/constant/categoryAxes';
import type { CategorySaveRequestBody } from '@/app/category/interface/CategorySaveRequestBody';
import { getLevelConfig, toSaveRequest } from '@/app/category/utils/CategoryUtils';

/**
 * 분류 수정 훅 (5개 축, 상위/하위 공용)
 * 성공해도 서버가 data 를 주지 않으므로, 화면 갱신은 호출한 쪽이 목록을 다시 불러와서 한다.
 */
const useUpdateCategory = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUpdateCategory = async (
    axis: CategoryAxisKey,
    level: CategoryLevel,
    id: number,
    body: CategorySaveRequestBody,
  ): Promise<ApiResponse<null>> => {
    const levelConfig = getLevelConfig(axis, level);

    setLoading(true);
    try {
      const res = await api.put<ApiResponse<null>>(`${levelConfig.path}/${id}`, toSaveRequest(axis, level, body));
      return res.data;
    } catch (err) {
      return toApiResponse<null>(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateCategoryLoading: loading, fetchUpdateCategory };
};

export default useUpdateCategory;
