import { Box, Button, ListItemButton, Popover } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

/* 필터 줄의 칸 일곱 개(분류 5개, 배송월, 정렬)가 같이 쓰는 버튼. 고른 값이 있으면(filled) 금색 테두리와 글자로 표시한다 */
export const FilterButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'filled' })<{ filled?: boolean }>(
  ({ theme, filled = false }) => ({
    flexShrink: 0,
    fontWeight: 400,
    color: filled ? theme.palette.primary.main : theme.palette.text.primary,
    borderColor: filled ? theme.palette.primary.main : theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    paddingRight: theme.spacing(0.75),
    '&:hover': { borderColor: theme.palette.primary.main },
    /* 글자와 화살표, 화살표와 오른쪽 벽 사이를 좁힌다 */
    '& .MuiButton-endIcon': { marginLeft: theme.spacing(0.25), marginRight: 0 },
  }),
);

/* 필터 목록을 띄우는 팝오버. 버튼과 4px 띄우고, 바깥 틀은 투명하게 두고, 열마다 따로 카드 모양을 가진다(하위 목록이 옆에 따로 뜨기 위해) */
export const FilterPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    marginTop: theme.spacing(0.5),
    overflow: 'visible',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    boxShadow: 'none',
  },
}));

/* 눌렀을 때 뜨는 목록 한 장(카드). 화면 배경보다 확실히 밝은 보라색 면이다 */
export const FilterColumn = styled(Box)(({ theme }) => ({
  minWidth: theme.spacing(17.5),
  maxHeight: theme.spacing(50),
  overflowY: 'auto',
  backgroundColor: theme.palette.menuSurface,
  border: `1px solid ${theme.palette.menuLine}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[8],
}));

/* 하위 목록 카드는 한 단계 밝은 면이라 상위와 면의 밝기로 구분된다 */
export const FilterSubColumn = styled(FilterColumn)(({ theme }) => ({
  minWidth: theme.spacing(19),
  backgroundColor: theme.palette.menuSurfaceSub,
  '& .MuiListItemButton-root': { paddingLeft: theme.spacing(1.75) },
}));

/*
* 하위 목록 카드를 올린 상위 행 높이에서 오른쪽에 띄우는 틀(top 은 호출한 쪽이 정한다).
* 상위 카드와 사이의 간격은 마우스가 지나갈 때 끊기지 않도록 이 틀의 안쪽 여백으로 만든다.
* */
export const FilterSubWrap = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '100%',
  paddingLeft: theme.spacing(0.75),
}));

/*
* 목록 한 행. 고른 값(selected)은 금색 굵은 글자 + 옅은 금색 면 + ✓, 열려 있는 상위(open)는 밝은 면 + 왼쪽 금색 막대,
* 마우스를 올린 행은 밝은 면으로 표시한다.
* */
export const FilterItem = styled(ListItemButton, { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean }>(
  ({ theme, open = false }) => ({
    padding: theme.spacing(0.875, 1.5),
    borderLeft: `3px solid ${open ? theme.palette.primary.main : 'transparent'}`,
    backgroundColor: open ? theme.palette.menuOpen : 'transparent',
    '& .MuiListItemText-primary': { ...theme.typography.body2 },
    '&:hover': { backgroundColor: theme.palette.menuHover },
    '&.Mui-selected, &.Mui-selected:hover': {
      color: theme.palette.primary.main,
      backgroundColor: open ? theme.palette.menuOpen : alpha(theme.palette.primary.main, 0.16),
    },
    '&.Mui-selected .MuiListItemText-primary': { fontWeight: 700 },
    '&.Mui-selected::after': { content: '"✓"', marginLeft: theme.spacing(1), fontSize: '0.75rem' },
  }),
);

/* 값을 골랐다는 표시(금색 점) */
export const FilterDot = styled('span')(({ theme }) => ({
  width: theme.spacing(0.75),
  height: theme.spacing(0.75),
  marginLeft: theme.spacing(0.75),
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
}));
