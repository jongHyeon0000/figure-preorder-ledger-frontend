import type { CategoryItem } from '@/app/category/interface/CategoryItem';

export interface CategoryGroup extends CategoryItem {
  /** 하위 분류 목록. 하위가 있는 4개 축은 항상 오고(없으면 빈 배열), 하위가 없는 축(제조사) 응답에는 이 필드가 없다 */
  children: CategoryItem[];
}
