import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { FigureSaveRequestBody } from '@/app/figure/interface/FigureSaveRequestBody';
import type { FigureSummary } from '@/app/figure/interface/FigureSummary';

/**
 * 상품 등록 훅. 성공하면 만들어진 상품(설명 제외)이 data 로 온다.
 */
const useCreateFigure = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCreateFigure = async (body: FigureSaveRequestBody): Promise<ApiResponse<FigureSummary | null>> => {
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<FigureSummary | null>>('/api/figure', body);
      return res.data;
    } catch (err) {
      return toApiResponse<FigureSummary>(err);
    } finally {
      setLoading(false);
    }
  };

  return { createFigureLoading: loading, fetchCreateFigure };
};

export default useCreateFigure;
