/** 상품이 가진 분류 한 건 (형태, 판매처, 시리즈, 캐릭터. 서버가 주는 모양 그대로) */
export interface FigureCategoryRef {
  /** 분류(하위) id */
  id: number;

  /** 분류 이름 */
  name: string;

  /** 상위 분류 id */
  groupId: number;

  /** 상위 분류 이름 */
  groupName: string;
}
