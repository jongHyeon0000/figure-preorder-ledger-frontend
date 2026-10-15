import { FIGURE_FILTER_KEYS, FIGURE_FILTER_LABELS } from '@/app/figure/constant/figureFilter';
import type { FigureFilterOptions } from '@/app/figure/interface/FigureFilterOptions';
import type { FigureFilterKey, FigureFilters } from '@/app/figure/interface/FigureFilters';
import { getFilterValueText } from '@/app/figure/utils/FigureUtils';
import { Box, Chip } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

interface FigureFilterChipsProps {
  /** 고른 분류 필터 */
  filters: FigureFilters;

  /** 지금 탭의 선택지 (고른 값의 이름을 찾는 데 쓴다) */
  options: FigureFilterOptions;

  /** 칩의 ✕를 눌러 그 필터를 해제할 때 */
  onClear: (key: FigureFilterKey) => void;
}

/**
 * 고른 분류 필터 값을 칩으로 보여 준다("상위 > 하위" 전부 표기).
 * 고른 필터가 없으면 아무것도 그리지 않고, 칩이 많아 한 줄에 안 들어가면 칩끼리 다음 줄로 내려간다.
 */
const FigureFilterChips = ({ filters, options, onClear }: FigureFilterChipsProps) => {
  if (FIGURE_FILTER_KEYS.every((key) => filters[key] === null)) return null;

  return (
    <Chips>
      {FIGURE_FILTER_KEYS.map((key) => {
        const value = filters[key];
        if (value === null) return null;

        return (
          <FilterChip
            key={key}
            size="small"
            label={
              <>
                <FilterName>{FIGURE_FILTER_LABELS[key]}</FilterName>
                {getFilterValueText(key, value, options)}
              </>
            }
            onDelete={() => onClear(key)}
          />
        );
      })}
    </Chips>
  );
};

export default FigureFilterChips;

/* ───────── styles ───────── */

const Chips = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.75),
  marginTop: theme.spacing(1.75),
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.14),
  '& .MuiChip-deleteIcon': { color: theme.palette.primary.main, opacity: 0.7 },
}));

const FilterName = styled('span')(({ theme }) => ({
  marginRight: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));
