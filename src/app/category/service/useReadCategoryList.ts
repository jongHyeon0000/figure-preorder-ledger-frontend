import { useRef, useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import { CATEGORY_AXES, type CategoryAxisKey } from '@/app/category/constant/categoryAxes';
import type { CategoryGroup } from '@/app/category/interface/CategoryGroup';

/**
 * 분류 목록 조회 훅 (5개 축 공용)
 *
 * 상위 목록을 조회하면 하위가 중첩돼 오므로 축마다 요청은 한 번이다.
 * 서버 응답을 그대로 담는다.
 */
const useReadCategoryList = () => {
  const [categoryList, setCategoryList] = useState<ApiResponse<CategoryGroup[] | null> | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  /* 탭을 빠르게 바꿀 때 늦게 도착한 이전 축의 응답이 화면을 덮지 않도록, 마지막 요청의 응답만 반영한다 */
  const lastRequestId = useRef<number>(0);

  const fetchReadCategoryList = async (axis: CategoryAxisKey): Promise<void> => {
    lastRequestId.current += 1;
    const requestId = lastRequestId.current;

    setLoading(true);
    try {
      const res = await api.get<ApiResponse<CategoryGroup[] | null>>(CATEGORY_AXES[axis].group.path);
      if (requestId !== lastRequestId.current) return;

      setCategoryList(res.data);
    } catch (err) {
      if (requestId !== lastRequestId.current) return;
      setCategoryList(toApiResponse<CategoryGroup[]>(err));
    } finally {
      if (requestId === lastRequestId.current) setLoading(false);
    }
  };

  return { categoryList, categoryListLoading: loading, fetchReadCategoryList };
};

export default useReadCategoryList;
