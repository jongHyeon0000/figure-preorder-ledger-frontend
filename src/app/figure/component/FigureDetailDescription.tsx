import { Box, Typography } from '@mui/material';
import HtmlView from '@/app/common/component/HtmlView';
import { ColumnCard, SectionTitle } from '@/app/common/style/CommonCard.style';
import type { FigureDetail } from '@/app/figure/interface/FigureDetail';
import { formatDeadline } from '@/app/figure/utils/FigureUtils';
import { styled } from '@mui/material/styles';

interface FigureDetailDescriptionProps {
  /** 보여 줄 상품 */
  figure: FigureDetail;
}

/**
 * 설명 구역. 어두운 상자 안에 에디터로 쓴 설명(HTML)이 나오고, 아래에 등록, 수정 일자가 있다(표시 전용).
 */
const FigureDetailDescription = ({ figure }: FigureDetailDescriptionProps) => {
  return (
    <ColumnCard>
      <SectionTitle variant="h6" component="h3">
        설명
      </SectionTitle>

      <Content>
        {figure.description ? (
          <HtmlView html={figure.description} />
        ) : (
          <Typography color="text.secondary">등록된 설명이 없어요</Typography>
        )}
      </Content>

      <Typography variant="caption" color="text.secondary">
        등록 {formatDeadline(figure.createdAt)} · 수정 {formatDeadline(figure.updatedAt)}
      </Typography>
    </ColumnCard>
  );
};

export default FigureDetailDescription;

/* ───────── styles ───────── */

/* 설명이 들어가는 어두운 상자 */
const Content = styled(Box)(({ theme }) => ({
  minHeight: theme.spacing(15),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.surfaceSunken,
  border: `1px solid ${theme.palette.lineSubtle}`,
  borderRadius: theme.shape.borderRadius,
}));
