import { useState, type MouseEvent } from 'react';
import { Box, Button, List, ListItemButton, ListItemText, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { FigureFilterOptionGroup } from '@/app/figure/interface/FigureFilterOptionGroup';
import type { FigureFilterOptionItem } from '@/app/figure/interface/FigureFilterOptionItem';
import type { FigureFilterValue } from '@/app/figure/interface/FigureFilterValue';

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
 * 분류 필터 칸. 누르면 목록이 뜬다.
 * 하위가 있는 분류는 상위에 마우스를 올리면 오른쪽에 하위가 펼쳐진다.
 * 상위를 누르면 그 상위의 하위 전부, 하위를 누르면 그 하위 하나로 거른다.
 */
const FigureCategoryFilter = ({ label, groups = [], items = [], value, onChange }: FigureCategoryFilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hoverGroupId, setHoverGroupId] = useState<number | null>(null);

  const isFlat = groups.length === 0;
  const hoverGroup = groups.find((group) => group.groupId === hoverGroupId);

  /* 버튼에 보여 줄 이름: 판매처, 판매처: 네이버 스토어, 판매처: 네이버 스토어 / 굿스마일 PW */
  const buttonText = (): string => {
    if (value === null) return `${label} 전체`;
    if (isFlat) return `${label}: ${items.find((item) => item.id === value.itemId)?.name ?? ''}`;

    const group = groups.find((candidate) => candidate.groupId === value.groupId);
    const item = group?.items.find((candidate) => candidate.id === value.itemId);
    return `${label}: ${[group?.groupName, item?.name].filter(Boolean).join(' / ')}`;
  };

  const handleOpen = (e: MouseEvent<HTMLElement>) => {
    setHoverGroupId(value?.groupId ?? null);
    setAnchorEl(e.currentTarget);
  };

  const handleSelect = (next: FigureFilterValue | null) => {
    onChange(next);
    setAnchorEl(null);
  };

  return (
    <>
      <FilterButton
        variant="outlined"
        color="inherit"
        size="small"
        filled={value !== null}
        endIcon={<ArrowDropDownIcon />}
        onClick={handleOpen}
      >
        {buttonText()}
      </FilterButton>

      <Popover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Columns>
          <Column>
            <List disablePadding>
              <ListItemButton selected={value === null} onClick={() => handleSelect(null)}>
                <ListItemText primary={`${label} 전체`} />
              </ListItemButton>

              {isFlat &&
                items.map((item) => (
                  <ListItemButton
                    key={item.id}
                    selected={value?.itemId === item.id}
                    onClick={() => handleSelect({ groupId: null, itemId: item.id })}
                  >
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}

              {groups.map((group) => (
                <ListItemButton
                  key={group.groupId}
                  selected={value?.groupId === group.groupId && value.itemId === null}
                  onMouseEnter={() => setHoverGroupId(group.groupId)}
                  onClick={() => handleSelect({ groupId: group.groupId, itemId: null })}
                >
                  <ListItemText primary={group.groupName} />
                  <ChevronRightIcon fontSize="small" color={hoverGroupId === group.groupId ? 'primary' : 'disabled'} />
                </ListItemButton>
              ))}
            </List>
          </Column>

          {hoverGroup && (
            <SubColumn>
              <List disablePadding>
                {hoverGroup.items.map((item) => (
                  <ListItemButton
                    key={item.id}
                    selected={value?.itemId === item.id}
                    onClick={() => handleSelect({ groupId: hoverGroup.groupId, itemId: item.id })}
                  >
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </SubColumn>
          )}
        </Columns>
      </Popover>
    </>
  );
};

export default FigureCategoryFilter;

/* ───────── styles ───────── */

/* 고른 값이 있으면 금색 테두리와 글자로 표시한다 */
const FilterButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'filled' })<{ filled: boolean }>(
  ({ theme, filled }) => ({
    flexShrink: 0,
    fontWeight: 400,
    color: filled ? theme.palette.primary.main : theme.palette.text.primary,
    borderColor: filled ? theme.palette.primary.main : theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    '&:hover': { borderColor: theme.palette.primary.main },
  }),
);

const Columns = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
});

const Column = styled(Box)(({ theme }) => ({
  minWidth: theme.spacing(24),
  maxHeight: theme.spacing(50),
  overflowY: 'auto',
}));

const SubColumn = styled(Column)(({ theme }) => ({
  borderLeft: `1px solid ${theme.palette.divider}`,
}));
