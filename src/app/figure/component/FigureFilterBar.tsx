import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import FigureCategoryFilter from '@/app/figure/component/FigureCategoryFilter';
import FigureFlatFilter from '@/app/figure/component/FigureFlatFilter';
import { FIGURE_SORT_OPTIONS, type FigureSortKey } from '@/app/figure/constant/figureSortOptions';
import type { FigureFilterOptions } from '@/app/figure/interface/FigureFilterOptions';
import type { FigureFilterValue } from '@/app/figure/interface/FigureFilterValue';
import type { FigureFilterKey, FigureFilters } from '@/app/figure/interface/FigureFilters';
import { formatDeliveryMonth } from '@/app/figure/utils/FigureUtils';

interface FigureFilterBarProps {
  /** 지금 탭의 상품에 쓰인 분류만 모은 선택지 */
  options: FigureFilterOptions;

  /** 고른 분류 필터 */
  filters: FigureFilters;

  /** 고른 배송월 ("YYYY-MM"). 없으면 null */
  month: string | null;

  /** 고른 정렬 */
  sort: FigureSortKey;

  /** 분류 필터를 골랐을 때 */
  onFilterChange: (key: FigureFilterKey, value: FigureFilterValue | null) => void;

  /** 배송월을 골랐을 때 */
  onMonthChange: (month: string | null) => void;

  /** 정렬을 골랐을 때 */
  onSortChange: (sort: FigureSortKey) => void;

  /** 필터 초기화 */
  onReset: () => void;
}

const SORT_OPTIONS = FIGURE_SORT_OPTIONS.map((option) => ({ value: option.key, label: option.label }));

/**
 * 필터 줄 (한 줄 고정). 왼쪽에 분류 필터, 오른쪽에 배송월과 정렬, 맨 오른쪽에 필터 초기화.
 */
const FigureFilterBar = ({
  options,
  filters,
  month,
  sort,
  onFilterChange,
  onMonthChange,
  onSortChange,
  onReset,
}: FigureFilterBarProps) => {
  return (
    <Bar>
      <Side>
        <FigureCategoryFilter
          label="형태"
          groups={options.figureType}
          value={filters.figureType}
          onChange={(value) => onFilterChange('figureType', value)}
        />
        <FigureCategoryFilter
          label="판매처"
          groups={options.shop}
          value={filters.shop}
          onChange={(value) => onFilterChange('shop', value)}
        />
        <FigureCategoryFilter
          label="제조사"
          items={options.maker}
          value={filters.maker}
          onChange={(value) => onFilterChange('maker', value)}
        />
        <FigureCategoryFilter
          label="시리즈"
          groups={options.series}
          value={filters.series}
          onChange={(value) => onFilterChange('series', value)}
        />
        <FigureCategoryFilter
          label="장르·캐릭터"
          groups={options.character}
          value={filters.character}
          onChange={(value) => onFilterChange('character', value)}
        />
      </Side>

      <RightSide>
        <FigureFlatFilter
          allLabel="배송월 전체"
          options={options.months.map((option) => ({ value: option, label: formatDeliveryMonth(option) }))}
          value={month}
          onChange={onMonthChange}
        />
        <FigureFlatFilter
          options={SORT_OPTIONS}
          value={sort}
          onChange={(value) => onSortChange(value as FigureSortKey)}
        />
        <ResetButton variant="outlined" color="inherit" onClick={onReset}>
          필터 초기화
        </ResetButton>
      </RightSide>
    </Bar>
  );
};

export default FigureFilterBar;

/* ───────── styles ───────── */

const Bar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

const Side = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const RightSide = styled(Side)({
  marginLeft: 'auto',
  flexShrink: 0,
});

const ResetButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  fontWeight: 400,
  color: theme.palette.text.secondary,
  borderColor: theme.palette.divider,
  '&:hover': { color: theme.palette.primary.main, borderColor: theme.palette.primary.main },
}));
