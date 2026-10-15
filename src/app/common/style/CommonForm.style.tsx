import { styled } from '@mui/material/styles';

/*
* <form> 본체 (입력칸을 세로로 쌓는다)
* */
export const FormBody = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));
