import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/*
* 페이지 바깥 틀 (가운데 정렬, 콘텐츠 최대 폭, 상단 GNB 아래 여백)
* */
export const PageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  padding: theme.spacing(3, 2, 8),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4, 3, 10),
  },
}));

/*
* 페이지 제목 줄 (왼쪽 제목, 오른쪽 동작 버튼)
* */
export const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
})) as typeof Typography;
