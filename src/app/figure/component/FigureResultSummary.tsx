import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatPrice } from '@/app/common/utils/CommonUtils';

interface FigureResultSummaryProps {
  /** 지금 보이는 상품 수 */
  count: number;

  /** 보이는 상품의 합계 (개당 가격 × 수량을 모두 더한 값) */
  totalPrice: number;

  /** 보이는 상품에서 지금까지 낸 금액 (예약완료는 예약금, 구매완료와 배송완료는 총액) */
  paidAmount: number;
}

/**
 * 결과 요약 한 줄 (총 N개 표시 중 · 합계 · 구매액). 탭 줄 오른쪽 끝에 둔다.
 */
const FigureResultSummary = ({ count, totalPrice, paidAmount }: FigureResultSummaryProps) => {
  return (
    <Summary color="text.secondary" variant="body2">
      총 <Strong>{count}</Strong>개 표시 중 · 합계 <Strong>{formatPrice(totalPrice)}</Strong> · 구매액 <Strong>{formatPrice(paidAmount)}</Strong>
    </Summary>
  );
};

export default FigureResultSummary;

/* ───────── styles ───────── */

const Summary = styled(Typography)(({ theme }) => ({
  flexShrink: 0,
  alignSelf: 'flex-end',
  paddingBottom: theme.spacing(1.5),
  whiteSpace: 'nowrap',
})) as typeof Typography;

const Strong = styled('b')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
}));
