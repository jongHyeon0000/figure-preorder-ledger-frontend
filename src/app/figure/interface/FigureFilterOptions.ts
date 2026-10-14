import type { FigureFilterOptionGroup } from '@/app/figure/interface/FigureFilterOptionGroup';
import type { FigureFilterOptionItem } from '@/app/figure/interface/FigureFilterOptionItem';

/** 지금 탭의 상품에 쓰인 분류만 모은 필터 선택지 */
export interface FigureFilterOptions {
  figureType: FigureFilterOptionGroup[];
  shop: FigureFilterOptionGroup[];
  series: FigureFilterOptionGroup[];
  character: FigureFilterOptionGroup[];
  maker: FigureFilterOptionItem[];

  /** 배송예정월 ("YYYY-MM", 오름차순) */
  months: string[];
}
