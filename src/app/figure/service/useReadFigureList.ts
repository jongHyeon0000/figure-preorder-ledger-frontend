import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { FigureSummary } from '@/app/figure/interface/FigureSummary';

/**
 * 상품 목록 조회 훅
 * 서버는 설명(HTML)을 뺀 전체 목록을 한 번에 준다. 탭, 필터, 정렬은 화면에서 한다.
 */
const useReadFigureList = () => {
  const [figureList, setFigureList] = useState<ApiResponse<FigureSummary[] | null> | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReadFigureList = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<FigureSummary[] | null>>('/api/figure');
      setFigureList(res.data);
    } catch (err) {
      setFigureList(toApiResponse<FigureSummary[]>(err));
    } finally {
      setLoading(false);
    }
  };

  return { figureList, figureListLoading: loading, fetchReadFigureList };
};

export default useReadFigureList;
