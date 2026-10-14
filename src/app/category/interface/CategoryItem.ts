export interface CategoryItem {
  /** 분류 id (서버는 축마다 다른 이름의 필드로 주지만 훅이 이 이름으로 맞춘다) */
  id: number;

  /** 상위 분류 id. 상위 항목이거나 제조사면 null */
  parentId: number | null;

  /** 이름 (100자 이하) */
  name: string;

  /** 설명. 없으면 빈 문자열 */
  description: string;

  /** 썸네일 주소 ('/uploads/...' 상대 경로). 없으면 null */
  thumbnailUrl: string | null;
}
