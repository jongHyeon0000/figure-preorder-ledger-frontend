import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { ThumbnailTarget } from '@/app/common/constant/thumbnailTarget';
import type { ThumbnailUrlResponse } from '@/app/common/interface/ThumbnailUrlResponse';

/**
 * 썸네일 올리기 훅 (상품, 분류 공용)
 * 대상(상품, 분류)을 먼저 저장해 id 를 받은 뒤에 올린다. 이미 썸네일이 있으면 새 파일로 바뀐다.
 */
const useUploadThumbnail = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUploadThumbnail = async (
    targetType: ThumbnailTarget,
    targetId: number,
    file: File,
  ): Promise<ApiResponse<ThumbnailUrlResponse | null>> => {
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await api.put<ApiResponse<ThumbnailUrlResponse>>(
        `/api/upload/thumbnail-image/${targetType}/${targetId}`,
        formData,
      );
      return res.data;
    } catch (err) {
      return toApiResponse<ThumbnailUrlResponse>(err);
    } finally {
      setLoading(false);
    }
  };

  return { uploadThumbnailLoading: loading, fetchUploadThumbnail };
};

export default useUploadThumbnail;
