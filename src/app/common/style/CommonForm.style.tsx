import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/*
* 폼 한 묶음 (제목 + 입력칸들을 면으로 감싼다)
* */
export const FormSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.lineSubtle}`,
  borderRadius: 12,
}));

export const FormSectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
})) as typeof Typography;

/*
* 입력칸 한 줄 (좁은 화면에서는 세로, 넓은 화면에서는 가로로 나란히)
* */
export const FormRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

/*
* 폼 아래 버튼 줄 (오른쪽 정렬)
* */
export const FormActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(1),
}));
