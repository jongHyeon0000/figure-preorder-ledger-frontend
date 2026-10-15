import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/*
* 강조하는 글자 (포인트 색, 굵게). 개수, 합계 등
* */
export const Highlight = styled('b')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

/*
* 이름표 글자 (흐린 색). 값 앞에 붙는 "장르", "형태" 같은 글자
* */
export const LabelText = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

/*
* 이름표 옆의 값 글자 (한 줄, 길면 …로 줄임)
* */
export const ValueText = styled('span')(({ theme }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: theme.palette.text.primary,
  fontWeight: 500,
}));

/*
* 이름표-값 두 칸 그리드 (이름표 칸 폭은 가장 긴 이름표를 따르고 값은 같은 세로선에서 시작한다).
* 줄(LabelValueRow)은 칸만 거드는 display: contents 라서 줄들이 같은 칸을 같이 쓴다
* */
export const LabelValueGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: theme.spacing(1.5),
  rowGap: theme.spacing(0.5),
  alignItems: 'baseline',
}));

export const LabelValueRow = styled(Box)({
  display: 'contents',
});

/*
* 가격 글자 (고정폭 글꼴, 포인트 색, 굵게). 크기는 md(목록 카드), lg(상세, 폼)
* */
export const PriceText = styled(Typography, { shouldForwardProp: (prop) => prop !== 'size' })<{ size?: 'md' | 'lg' }>(
  ({ theme, size = 'md' }) => ({
    ...theme.typography.mono,
    fontSize: size === 'lg' ? '1.9375rem' : '1.25rem',
    fontWeight: 700,
    color: theme.palette.primary.main,
  }),
);

/*
* 가격과 그 아래 내역을 오른쪽 끝에 세로로 쌓는 칸
* */
export const PriceColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing(0.75),
}));

/*
* 굵은 일반 글자 (목록 항목 이름, 부제목 등)
* */
export const BoldText = styled(Typography)({
  fontWeight: 700,
}) as typeof Typography;
