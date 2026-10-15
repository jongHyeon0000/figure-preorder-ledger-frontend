import { useState } from 'react';
import { List, ListItemText } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FilterButton, FilterColumn, FilterItem, FilterPopover } from '@/app/figure/style/FigureFilter.style';

interface FigureFlatFilterOption {
  value: string;
  label: string;
}

interface FigureFlatFilterProps {
  /** 맨 위 "전체" 항목의 이름 (예: "배송월 전체"). 없으면 전체 항목 없이 항상 하나가 선택된다(정렬) */
  allLabel?: string;

  /** 고를 수 있는 값 */
  options: FigureFlatFilterOption[];

  /** 지금 고른 값. 전체이면 null */
  value: string | null;

  /** 값을 골랐을 때 (null 이면 "전체") */
  onChange: (value: string | null) => void;
}

/**
 * 한 줄 목록에서 하나를 고르는 필터 칸 (배송월, 정렬).
 * 분류 필터(FigureCategoryFilter)와 같은 버튼과 목록 모양을 쓴다.
 */
const FigureFlatFilter = ({ allLabel, options, value, onChange }: FigureFlatFilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleFilterSelect = (next: string | null) => {
    onChange(next);
    setAnchorEl(null);
  };

  return (
    <>
      <FilterButton
        variant="outlined"
        color="inherit"
        filled={allLabel !== undefined && value !== null}
        endIcon={<ArrowDropDownIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {options.find((option) => option.value === value)?.label ?? allLabel}
      </FilterButton>

      <FilterPopover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <FilterColumn>
          <List disablePadding>
            {allLabel !== undefined && (
              <FilterItem selected={value === null} onClick={() => handleFilterSelect(null)}>
                <ListItemText primary={allLabel} />
              </FilterItem>
            )}
            {options.map((option) => (
              <FilterItem key={option.value} selected={option.value === value} onClick={() => handleFilterSelect(option.value)}>
                <ListItemText primary={option.label} />
              </FilterItem>
            ))}
          </List>
        </FilterColumn>
      </FilterPopover>
    </>
  );
};

export default FigureFlatFilter;
