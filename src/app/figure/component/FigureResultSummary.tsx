import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatPrice } from '@/app/common/utils/CommonUtils';

interface FigureResultSummaryProps {
  /** 지금 보이는 상품 수 */
  count: number;

  /** 보이는 상품의 총액 (개당 가격 × 수량) */
  totalPrice: number;

  /** 보이는 상품에서 지금까지 낸 금액 (예약완료는 예약금, 구매완료와 배송완료는 총액) */
  paidAmount: number;
}

/**
 * 목록 위의 결과 요약 (총 N개 · 총액 · 지출)
 */
const FigureResultSummary = ({ count, totalPrice, paidAmount }: FigureResultSummaryProps) => {
  return (
    <Typography color="text.secondary" variant="body2">
      총 <Strong>{count}</Strong>개 표시 중 · 총액 <Strong>{formatPrice(totalPrice)}</Strong> · 지출 <Strong>{formatPrice(paidAmount)}</Strong>
    </Typography>
  );
};

export default FigureResultSummary;

/* ───────── styles ───────── */

const Strong = styled('b')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
}));
