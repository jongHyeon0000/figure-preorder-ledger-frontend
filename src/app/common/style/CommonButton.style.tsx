import { Button } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

/* 은은하게 색을 깐 버튼 (꽉 찬 contained 버튼보다 한 단계 약하게) */
export const TonalButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  backgroundColor: alpha(theme.palette.primary.main, 0.26),
  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.38) },
}));

export const TonalDangerButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 700,
  backgroundColor: alpha(theme.palette.error.main, 0.26),
  '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.38) },
}));
