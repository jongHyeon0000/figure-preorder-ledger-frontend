import { Avatar, Box } from '@mui/material';
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

/*
* 안내 화면(비었을 때, 실패, 이미지 없음)의 큰 아이콘 칸. 안에 fontSize="inherit" 아이콘을 둔다. 글자색은 보조색이고, 아이콘의 color 로 바꿀 수 있다
* */
export const StateIcon = styled('span', { shouldForwardProp: (prop) => prop !== 'size' })<{ size?: 'md' | 'lg' }>(
  ({ theme, size = 'md' }) => ({
    display: 'inline-flex',
    fontSize: size === 'md' ? '3rem' : '4rem',
    color: theme.palette.text.secondary,
  }),
);

/*
* 동그란 썸네일 (이미지가 없으면 안의 아이콘을 보여 준다)
* */
export const ThumbAvatar = styled(Avatar, { shouldForwardProp: (prop) => prop !== 'size' })<{ size: 'sm' | 'lg' }>(
  ({ theme, size }) => ({
    width: theme.spacing(size === 'sm' ? 4 : 7),
    height: theme.spacing(size === 'sm' ? 4 : 7),
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.menuSurfaceSub,
  }),
);
