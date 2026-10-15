import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';

/**
 * 상품 여러 개 삭제 훅. 하나라도 없는 상품이면 서버가 전부 취소한다. 성공해도 data 가 없다.
 */
const useDeleteFigureList = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDeleteFigureList = async (figureIds: number[]): Promise<ApiResponse<null>> => {
    setLoading(true);
    try {
      /* 배열을 그대로 넘기면 figureIds[]= 로 직렬화되므로 쉼표로 이어 보낸다 */
      const res = await api.delete<ApiResponse<null>>('/api/figure', { params: { figureIds: figureIds.join(',') } });
      return res.data;
    } catch (err) {
      return toApiResponse<null>(err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteFigureListLoading: loading, fetchDeleteFigureList };
};

export default useDeleteFigureList;
