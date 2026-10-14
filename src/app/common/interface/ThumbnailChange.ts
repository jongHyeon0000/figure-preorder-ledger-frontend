/**
 * 폼 안에서 고른 썸네일 변경 사항. 저장 버튼을 누를 때 한꺼번에 서버에 보낸다.
 * - none: 건드리지 않음
 * - upload: 새 파일을 골랐음 (previewUrl 은 화면에 미리 보여 주는 용도의 data 주소)
 * - delete: 지우기로 했음 (이미 올라간 썸네일이 있을 때만 가능)
 */
export type ThumbnailChange =
  | { type: 'none' }
  | { type: 'upload'; file: File; previewUrl: string }
  | { type: 'delete' };
