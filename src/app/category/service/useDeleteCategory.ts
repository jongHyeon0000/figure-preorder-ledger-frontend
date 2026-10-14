import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { CategoryAxisKey, CategoryLevel } from '@/app/category/constant/categoryAxes';
import { getLevelConfig } from '@/app/category/utils/CategoryUtils';

/**
 * 분류 삭제 훅 (5개 축, 상위/하위 공용)
 * 삭제하면 쓰던 상품은 서버가 '기타'로 옮긴다. 성공해도 data 가 없으므로 호출한 쪽이 목록을 다시 불러온다.
 */
const useDeleteCategory = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDeleteCategory = async (axis: CategoryAxisKey, level: CategoryLevel, id: number): Promise<ApiResponse<null>> => {
    const levelConfig = getLevelConfig(axis, level);

    setLoading(true);
    try {
      const res = await api.delete<ApiResponse<null>>(`${levelConfig.path}/${id}`);
      return res.data;
    } catch (err) {
      return toApiResponse<null>(err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteCategoryLoading: loading, fetchDeleteCategory };
};

export default useDeleteCategory;
