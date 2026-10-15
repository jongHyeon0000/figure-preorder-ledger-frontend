import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { FigureSaveRequestBody } from '@/app/figure/interface/FigureSaveRequestBody';
import type { FigureSummary } from '@/app/figure/interface/FigureSummary';

/**
 * 상품 수정 훅. 성공하면 수정된 상품(설명 제외)이 data 로 온다.
 */
const useUpdateFigure = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUpdateFigure = async (
    figureId: number,
    body: FigureSaveRequestBody,
  ): Promise<ApiResponse<FigureSummary | null>> => {
    setLoading(true);
    try {
      const res = await api.put<ApiResponse<FigureSummary | null>>(`/api/figure/${figureId}`, body);
      return res.data;
    } catch (err) {
      return toApiResponse<FigureSummary>(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateFigureLoading: loading, fetchUpdateFigure };
};

export default useUpdateFigure;
