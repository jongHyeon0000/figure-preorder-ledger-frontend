import type { CategoryGroup } from '@/app/category/interface/CategoryGroup';
import type { CategoryItem } from '@/app/category/interface/CategoryItem';

/** 상품 폼과 상세가 쓰는 분류 선택지 묶음 (5개 축) */
export interface FigureFormOptions {
  /** 판매처 채널 > 스토어 */
  shops: CategoryGroup[];

  /** 형태 > 하위 형태 */
  types: CategoryGroup[];

  /** 시리즈 그룹 > 시리즈 */
  series: CategoryGroup[];

  /** 장르 > 캐릭터 */
  genres: CategoryGroup[];

  /** 제조사 (상하위 없이 평면) */
  makers: CategoryItem[];
}
