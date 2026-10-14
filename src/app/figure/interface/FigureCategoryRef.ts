/** 상품이 가진 분류 한 건 (서버는 분류마다 다른 이름의 필드로 주지만 공통 모양으로 맞춘다) */
export interface FigureCategoryRef {
  /** 분류(하위) id */
  id: number;

  /** 상위 분류 id. 제조사처럼 상위가 없으면 null */
  groupId: number | null;

  /** 분류 이름 */
  name: string;

  /** 상위 분류 이름. 상위가 없으면 빈 문자열 */
  groupName: string;
}
