import type { FigureFilterOptionItem } from '@/app/figure/interface/FigureFilterOptionItem';

/** 필터 목록의 상위 한 건과 그 아래 하위들 */
export interface FigureFilterOptionGroup {
  groupId: number;
  groupName: string;
  items: FigureFilterOptionItem[];
}
