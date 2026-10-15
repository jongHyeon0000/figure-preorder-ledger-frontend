/** 분류 선택 창에 나오는 한 건 (5개 축의 하위, 상위, 제조사를 같은 모양으로 맞춘 것) */
export interface FigurePickItem {
  /** 분류 id */
  id: number;

  /** 이름 */
  name: string;

  /** 상위 id. 상위가 있는 하위에만 있다 */
  groupId?: number;

  /** 상위 이름 */
  groupName?: string;

  /** 썸네일 주소. 없으면 이미지 아이콘 */
  thumbnailUrl?: string;
}
