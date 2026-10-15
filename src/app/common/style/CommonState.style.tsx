import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

/*
* 비었음, 오류, 없는 주소처럼 화면 자리에 가운데로 쌓아 보여 주는 표시 틀 (아이콘, 문구, 동작)
* */
export const StateStack = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(8, 0),
}));
