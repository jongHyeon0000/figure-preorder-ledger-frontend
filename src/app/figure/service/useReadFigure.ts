import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { FigureDetail } from '@/app/figure/interface/FigureDetail';

/**
 * 상품 상세 조회 훅
 */
const useReadFigure = () => {
  const [figure, setFigure] = useState<ApiResponse<FigureDetail | null> | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReadFigure = async (figureId: number): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<FigureDetail | null>>(`/api/figure/${figureId}`);
      setFigure(res.data);
    } catch (err) {
      setFigure(toApiResponse<FigureDetail>(err));
    } finally {
      setLoading(false);
    }
  };

  return { figure, figureLoading: loading, fetchReadFigure };
};

export default useReadFigure;
