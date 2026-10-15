import { useRef, useState, type MouseEvent } from 'react';
import { Box, List, ListItemText } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FilterButton, FilterColumn, FilterDot, FilterItem, FilterPopover, FilterSubColumn, FilterSubWrap } from '@/app/figure/style/FigureFilter.style';
import type { FigureFilterOptionGroup } from '@/app/figure/interface/FigureFilterOptionGroup';
import type { FigureFilterOptionItem } from '@/app/figure/interface/FigureFilterOptionItem';
import type { FigureFilterValue } from '@/app/figure/interface/FigureFilterValue';
import { styled } from '@mui/material/styles';

interface FigureCategoryFilterProps {
  /** 칸 이름 (예: "판매처") */
  label: string;

  /** 상위와 하위가 있는 분류의 선택지. 제조사처럼 하위가 없으면 비워 두고 items 를 쓴다 */
  groups?: FigureFilterOptionGroup[];

  /** 하위가 없는 분류의 선택지 */
  items?: FigureFilterOptionItem[];

  /** 지금 고른 값. 고르지 않았으면 null */
  value: FigureFilterValue | null;

  /** 값을 골랐을 때 (null 이면 "전체") */
  onChange: (value: FigureFilterValue | null) => void;
}

/**
 * 분류 필터 칸. 누르면 목록이 뜬다. 값을 골랐으면 금색 점이 붙고, 고른 값은 필터 줄 아래의 칩(FigureFilterChips)에 보인다.
 * 하위가 있는 분류는 상위에 마우스를 올리는 동안만, 그 행과 같은 높이의 오른쪽에 하위 목록 카드가 따로 뜨고 마우스가 벗어나면 접힌다.
 * 상위를 누르면 그 상위의 하위 전부, 하위를 누르면 그 하위 하나로 거른다.
 */
const FigureCategoryFilter = ({ label, groups = [], items = [], value, onChange }: FigureCategoryFilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hoverGroupId, setHoverGroupId] = useState<number | null>(null);
  const [hoverTop, setHoverTop] = useState<number>(0);
  const columnsRef = useRef<HTMLDivElement>(null);

  const isFlat = groups.length === 0;
  const hoverGroup = groups.find((group) => group.groupId === hoverGroupId);

  const handleFilterOpen = (e: MouseEvent<HTMLElement>) => {
    setHoverGroupId(null);
    setAnchorEl(e.currentTarget);
  };

  /* 올린 상위 행을 기억하고, 하위 목록 카드가 그 행과 같은 높이에서 시작하도록 위치를 잰다 */
  const handleHoverGroup = (e: MouseEvent<HTMLElement>, groupId: number) => {
    setHoverGroupId(groupId);
    setHoverTop(e.currentTarget.getBoundingClientRect().top - (columnsRef.current?.getBoundingClientRect().top ?? 0));
  };

  const handleFilterSelect = (next: FigureFilterValue | null) => {
    onChange(next);
    setAnchorEl(null);
  };

  return (
    <>
      <FilterButton
        variant="outlined"
        color="inherit"
        filled={value !== null}
        endIcon={<ArrowDropDownIcon />}
        onClick={handleFilterOpen}
      >
        {value === null ? `${label} 전체` : label}
        {value !== null && <FilterDot />}
      </FilterButton>

      <FilterPopover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Columns ref={columnsRef} onMouseLeave={() => setHoverGroupId(null)}>
          <FilterColumn>
            <List disablePadding>
              <FilterItem selected={value === null} onMouseEnter={() => setHoverGroupId(null)} onClick={() => handleFilterSelect(null)}>
                <ListItemText primary={`${label} 전체`} />
              </FilterItem>

              {isFlat &&
                items.map((item) => (
                  <FilterItem
                    key={item.id}
                    selected={value?.itemId === item.id}
                    onClick={() => handleFilterSelect({ groupId: null, itemId: item.id })}
                  >
                    <ListItemText primary={item.name} />
                  </FilterItem>
                ))}

              {groups.map((group) => (
                <FilterItem
                  key={group.groupId}
                  open={hoverGroupId === group.groupId}
                  selected={value?.groupId === group.groupId && value.itemId === null}
                  onMouseEnter={(e) => handleHoverGroup(e, group.groupId)}
                  onClick={() => handleFilterSelect({ groupId: group.groupId, itemId: null })}
                >
                  <ListItemText primary={group.groupName} />
                  <ChevronRightIcon fontSize="small" color={hoverGroupId === group.groupId ? 'primary' : 'disabled'} />
                </FilterItem>
              ))}
            </List>
          </FilterColumn>

          {hoverGroup && (
            <FilterSubWrap style={{ top: hoverTop }}>
              <FilterSubColumn>
                <List disablePadding>
                  {hoverGroup.items.map((item) => (
                    <FilterItem
                      key={item.id}
                      selected={value?.itemId === item.id}
                      onClick={() => handleFilterSelect({ groupId: hoverGroup.groupId, itemId: item.id })}
                    >
                      <ListItemText primary={item.name} />
                    </FilterItem>
                  ))}
                </List>
              </FilterSubColumn>
            </FilterSubWrap>
          )}
        </Columns>
      </FilterPopover>
    </>
  );
};

export default FigureCategoryFilter;

/* ───────── styles ───────── */

/* 상위 목록 카드가 차지하는 자리. 하위 목록 카드는 이 자리 오른쪽에 절대 위치로 뜬다 */
const Columns = styled(Box)({
  position: 'relative',
});
