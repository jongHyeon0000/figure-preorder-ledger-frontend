import type { CategoryItem } from '@/app/category/interface/CategoryItem';

export interface CategoryGroup extends CategoryItem {
  /** 하위 분류 목록. 하위가 없는 축(제조사)은 빈 배열 */
  children: CategoryItem[];
}
