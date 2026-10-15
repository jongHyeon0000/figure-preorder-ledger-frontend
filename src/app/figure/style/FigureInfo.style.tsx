import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

/*
* 상품 정보 카드와 분류 묶음 (상세와 폼이 같이 쓴다)
* */

/* 묶음 하나(한 단계 밝은 면). 안의 줄들이 같은 묶음이다 */
export const InfoGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.surfaceRaised,
  borderRadius: 12,
}));

export const InfoRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `${theme.spacing(9)} 1fr`,
  alignItems: 'center',
  columnGap: theme.spacing(1.5),
}));

export const InfoChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
