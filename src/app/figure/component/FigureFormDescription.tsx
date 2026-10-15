import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SectionCard, SectionTitle } from '@/app/common/style/CommonCard.style';

/**
 * 설명 구역. 에디터(Tiptap)는 다음 작업에서 붙이고, 그 전에는 자리만 둔다.
 * 수정할 때 기존 설명은 폼 값에 담겨 그대로 다시 저장된다.
 */
const FigureFormDescription = () => {
  return (
    <Card>
      <SectionTitle variant="h6" component="h3">
        설명
      </SectionTitle>
      <Content>
        <Typography color="text.secondary">설명 편집은 곧 추가돼요. 지금은 수정해도 기존 설명이 그대로 유지돼요.</Typography>
      </Content>
    </Card>
  );
};

export default FigureFormDescription;

/* ───────── styles ───────── */

const Card = styled(SectionCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const Content = styled(Box)(({ theme }) => ({
  minHeight: theme.spacing(15),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.surfaceSunken,
  border: `1px solid ${theme.palette.lineSubtle}`,
  borderRadius: theme.shape.borderRadius,
}));
