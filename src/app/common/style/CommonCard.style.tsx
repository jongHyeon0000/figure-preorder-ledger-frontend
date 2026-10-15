import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/*
* 화면을 구역으로 나누는 카드 (상세 화면의 썸네일, 정보, 일정, 설명 구역)
* */
const SectionCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.lineSubtle}`,
  borderRadius: theme.shape.cardRadius,
}));

/*
* 카드 안 구역 제목 (예: 설명)
* */
export const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
})) as typeof Typography;

/*
* 안에 구역들을 세로로 쌓는 카드 (상품 정보, 설명 구역)
* */
export const ColumnCard = styled(SectionCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

/*
* 위는 내용, 아래는 끝에 붙는 내용을 양 끝에 두는 카드 (일정과 금액 구역)
* */
export const SpreadCard = styled(SectionCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

/*
* 썸네일을 담는 카드 (폭이 좁아 안쪽 여백을 조금 줄인 구역)
* */
export const MediaCard = styled(SectionCard)(({ theme }) => ({
  padding: theme.spacing(2.5),
}));

/*
* 알약 모양 칸 (칩, 배지). 색과 안쪽 여백은 쓰는 쪽에서 정한다
* */
export const Pill = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: theme.shape.pillRadius,
}));
