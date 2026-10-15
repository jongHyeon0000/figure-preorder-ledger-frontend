import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';

/**
 * 상품 삭제 훅. 성공해도 data 가 없다.
 */
const useDeleteFigure = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDeleteFigure = async (figureId: number): Promise<ApiResponse<null>> => {
    setLoading(true);
    try {
      const res = await api.delete<ApiResponse<null>>(`/api/figure/${figureId}`);
      return res.data;
    } catch (err) {
      return toApiResponse<null>(err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteFigureLoading: loading, fetchDeleteFigure };
};

export default useDeleteFigure;
