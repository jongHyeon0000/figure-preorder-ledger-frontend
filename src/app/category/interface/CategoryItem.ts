/** 분류 한 건 (서버가 주는 모양 그대로. 5개 축이 같다) */
export interface CategoryItem {
  /** 분류 id */
  id: number;

  /** 이름 (100자 이하) */
  name: string;

  /** 설명. 없으면 필드가 빠져 있다 */
  description?: string;

  /** 썸네일 주소 ('/uploads/...' 상대 경로). 없으면 필드가 빠져 있다 */
  thumbnailUrl?: string;

  /** 상위 분류 id. 하위에만 있다 */
  groupId?: number;
}
