import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { FigureStatusRequestBody } from '@/app/figure/interface/FigureStatusRequestBody';
import type { FigureSummary } from '@/app/figure/interface/FigureSummary';

/**
 * 상품 상태 전이 훅(개별). 성공하면 바뀐 상품(설명 제외)이 data 로 온다.
 */
const useUpdateFigureStatus = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUpdateFigureStatus = async (
    figureId: number,
    body: FigureStatusRequestBody,
  ): Promise<ApiResponse<FigureSummary | null>> => {
    setLoading(true);
    try {
      const res = await api.patch<ApiResponse<FigureSummary | null>>(`/api/figure/${figureId}/status`, body);
      return res.data;
    } catch (err) {
      return toApiResponse<FigureSummary>(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateFigureStatusLoading: loading, fetchUpdateFigureStatus };
};

export default useUpdateFigureStatus;
