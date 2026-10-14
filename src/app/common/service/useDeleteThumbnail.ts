import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { ThumbnailTarget } from '@/app/common/constant/thumbnailTarget';

/**
 * 썸네일 지우기 훅 (상품, 분류 공용)
 * 썸네일이 없어도 서버는 성공으로 답한다. 성공해도 data 가 없다.
 */
const useDeleteThumbnail = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDeleteThumbnail = async (targetType: ThumbnailTarget, targetId: number): Promise<ApiResponse<null>> => {
    setLoading(true);
    try {
      const res = await api.delete<ApiResponse<null>>(`/api/upload/thumbnail-image/${targetType}/${targetId}`);
      return res.data;
    } catch (err) {
      return toApiResponse<null>(err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteThumbnailLoading: loading, fetchDeleteThumbnail };
};

export default useDeleteThumbnail;
