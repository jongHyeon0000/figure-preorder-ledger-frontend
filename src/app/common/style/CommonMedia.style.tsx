import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

/*
* 칸을 가득 채우는 이미지 (비율을 유지하며 잘라서 채운다)
* */
export const FillImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

/*
* 정사각형 칸 (폭에 맞춰 높이가 정해진다)
* */
export const SquareFrame = styled(Box)({
  aspectRatio: '1 / 1',
});

/*
* 썸네일 칸 (정사각형, 어두운 면, 이미지나 아이콘을 가운데에 둔다). 안에 배지를 겹쳐 올릴 수 있다
* */
export const ThumbFrame = styled(SquareFrame)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: theme.palette.surfaceRaised,
  borderRadius: theme.shape.borderRadius,
}));
