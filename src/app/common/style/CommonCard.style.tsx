import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/*
* 화면을 구역으로 나누는 카드 (상세 화면의 썸네일, 정보, 일정, 설명 구역)
* */
export const SectionCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.lineSubtle}`,
  borderRadius: 12,
}));

/*
* 카드 안 구역 제목 (예: 설명)
* */
export const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
})) as typeof Typography;
