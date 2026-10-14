import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/* 툴팁 안의 긴 글. 입력한 줄바꿈을 그대로 보여 준다 */
export const TooltipText = styled('span')({
  whiteSpace: 'pre-line',
});

/*
 * 설명을 띄우는 (i) 아이콘. 글자 줄 안에 글자처럼 넣어 쓴다(fontSize="inherit").
 * verticalAlign 은 글자 기준선에 맞추는 값이라 글꼴이 달라도 따로 위치를 보정하지 않는다.
 */
export const InfoIcon = styled(InfoOutlinedIcon)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  verticalAlign: '-0.125em',
  color: theme.palette.text.secondary,
  cursor: 'help',
  '&:hover': { color: theme.palette.primary.main },
}));
