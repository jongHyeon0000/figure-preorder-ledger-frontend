/** 썸네일 업로드 결과 (PUT /api/upload/thumbnail-image/{targetType}/{targetId}) */
export interface ThumbnailUrlResponse {
  /**
   * 이미지를 내려주는 주소 ('/uploads/...' 상대 경로)
   * @example "/uploads/1/thumbnail-image/shop-group/2026/10/uuid.png"
   */
  thumbnailUrl: string;
}
