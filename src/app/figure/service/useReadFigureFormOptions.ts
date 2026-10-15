import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { FigureFormOptions } from '@/app/figure/interface/FigureFormOptions';

/**
 * 분류 선택지 조회 훅. 5개 축의 상위/하위 트리를 한 번에 받는다.
 */
const useReadFigureFormOptions = () => {
  const [formOptions, setFormOptions] = useState<ApiResponse<FigureFormOptions | null> | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReadFigureFormOptions = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<FigureFormOptions | null>>('/api/figure/form-options');
      setFormOptions(res.data);
    } catch (err) {
      setFormOptions(toApiResponse<FigureFormOptions>(err));
    } finally {
      setLoading(false);
    }
  };

  return { formOptions, formOptionsLoading: loading, fetchReadFigureFormOptions };
};

export default useReadFigureFormOptions;
