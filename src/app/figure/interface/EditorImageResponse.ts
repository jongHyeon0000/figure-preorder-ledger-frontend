/** 에디터 이미지 업로드 결과 (POST /api/upload/editor-image) */
export interface EditorImageResponse {
  /** 에디터 이미지 id */
  editorImageId: number;

  /** 이미지 주소 ('/uploads/...' 상대 경로). 에디터의 src 에 이 값을 그대로 넣는다 */
  url: string;
}
