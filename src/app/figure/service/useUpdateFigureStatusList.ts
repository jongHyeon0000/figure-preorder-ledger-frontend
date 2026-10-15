import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { FigureStatusRequestBody } from '@/app/figure/interface/FigureStatusRequestBody';

/**
 * 상품 상태 전이 훅(일괄). 하나라도 허용되지 않으면 서버가 전부 취소한다. 성공하면 바뀐 상품 id 목록이 data 로 온다.
 */
const useUpdateFigureStatusList = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUpdateFigureStatusList = async (body: FigureStatusRequestBody): Promise<ApiResponse<number[] | null>> => {
    setLoading(true);
    try {
      const res = await api.patch<ApiResponse<number[] | null>>('/api/figure/status', body);
      return res.data;
    } catch (err) {
      return toApiResponse<number[]>(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateFigureStatusListLoading: loading, fetchUpdateFigureStatusList };
};

export default useUpdateFigureStatusList;
