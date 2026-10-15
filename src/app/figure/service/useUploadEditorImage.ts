import { useState } from 'react';
import { api } from '@/config/axios/AxiosConfig';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';
import { toApiResponse } from '@/config/axios/utils/toApiResponse';
import type { EditorImageResponse } from '@/app/figure/interface/EditorImageResponse';

/**
 * 에디터 이미지 올리기 훅. 설명에 넣을 이미지는 서버에 올려서 받은 주소로 넣는다(base64 는 서버가 400).
 * 올린 이미지가 상품 저장 때 설명에 쓰이지 않으면 서버가 1일 뒤 지운다.
 */
const useUploadEditorImage = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUploadEditorImage = async (file: File): Promise<ApiResponse<EditorImageResponse | null>> => {
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await api.post<ApiResponse<EditorImageResponse>>('/api/upload/editor-image', formData);
      return res.data;
    } catch (err) {
      return toApiResponse<EditorImageResponse>(err);
    } finally {
      setLoading(false);
    }
  };

  return { uploadEditorImageLoading: loading, fetchUploadEditorImage };
};

export default useUploadEditorImage;
