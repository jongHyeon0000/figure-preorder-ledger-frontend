/**
 * 분류 필터에서 고른 값.
 * 상위만 골랐으면 itemId 가 null (그 상위의 하위 전부), 하위를 골랐으면 itemId 가 그 하위.
 * 제조사처럼 상위가 없는 분류는 groupId 가 null 이다.
 */
export interface FigureFilterValue {
  groupId: number | null;
  itemId: number | null;
}
