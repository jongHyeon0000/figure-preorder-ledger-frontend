import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SectionCard } from '@/app/common/style/CommonCard.style';
import { formatPrice, todayString } from '@/app/common/utils/CommonUtils';
import FigureDeadlineText from '@/app/figure/component/FigureDeadlineText';
import type { FigureDetail } from '@/app/figure/interface/FigureDetail';
import { formatDeadline, formatDeliveryMonth, getTotalPrice, isDeadlinePassed } from '@/app/figure/utils/FigureUtils';

interface FigureDetailScheduleProps {
  /** 보여 줄 상품 */
  figure: FigureDetail;
}

/**
 * 일정과 금액 구역. 위는 날짜(값이 있는 것만 2열로), 아래는 총액과 내역(표시 전용).
 */
const FigureDetailSchedule = ({ figure }: FigureDetailScheduleProps) => {
  return (
    <Card>
      <Dates>
        {figure.reservationDeadline !== '' && (
          <DateRow>
            <Label>예약마감</Label>
            <FigureDeadlineText date={figure.reservationDeadline} passed={isDeadlinePassed(figure, todayString())} />
          </DateRow>
        )}
        {figure.balanceDueDate !== null && (
          <DateRow>
            <Label>잔금 기한</Label>
            <FigureDeadlineText date={figure.balanceDueDate} />
          </DateRow>
        )}
        <DateRow>
          <Label>배송예정</Label>
          <span>{formatDeliveryMonth(figure.deliveryMonth)}</span>
        </DateRow>
        {figure.depositPaidAt !== null && (
          <DateRow>
            <Label>예약금 결제</Label>
            <span>{formatDeadline(figure.depositPaidAt)}</span>
          </DateRow>
        )}
        {figure.paidAt !== null && (
          <DateRow>
            <Label>전액 결제</Label>
            <span>{formatDeadline(figure.paidAt)}</span>
          </DateRow>
        )}
        {figure.deliveredAt !== null && (
          <DateRow>
            <Label>배송완료</Label>
            <span>{formatDeadline(figure.deliveredAt)}</span>
          </DateRow>
        )}
      </Dates>

      <Money>
        <Price>{formatPrice(getTotalPrice(figure))}</Price>
        <Typography variant="mono" color="text.secondary">
          {formatPrice(figure.price)} × {figure.quantity}개
          {figure.depositAmount !== null && ` · 예약금 ${formatPrice(figure.depositAmount)}`}
        </Typography>
      </Money>
    </Card>
  );
};

export default FigureDetailSchedule;

/* ───────── styles ───────── */

const Card = styled(SectionCard)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

/* 이름표, 값, 이름표, 값 네 칸. 값이 같은 세로선에서 시작하도록 줄들이 칸을 같이 쓴다(DateRow 는 칸만 거든다) */
const Dates = styled(Box)(({ theme }) => ({
  ...theme.typography.mono,
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto 1fr',
  columnGap: theme.spacing(1.5),
  rowGap: theme.spacing(0.75),
  alignItems: 'baseline',
  marginBottom: theme.spacing(2.5),
  fontWeight: 500,
}));

const DateRow = styled(Box)({
  display: 'contents',
});

const Label = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: theme.typography.fontFamily,
  fontWeight: 400,
  whiteSpace: 'nowrap',
}));

const Money = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing(0.75),
}));

const Price = styled(Typography)(({ theme }) => ({
  ...theme.typography.mono,
  fontSize: '1.9375rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
}));
