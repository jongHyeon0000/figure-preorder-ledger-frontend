import { Typography } from '@mui/material';
import { formatPrice, todayString } from '@/app/common/utils/CommonUtils';
import FigureDeadlineText from '@/app/figure/component/FigureDeadlineText';
import type { FigureDetail } from '@/app/figure/interface/FigureDetail';
import { formatDeadline, formatDeliveryMonth, getTotalPrice, isDeadlinePassed } from '@/app/figure/utils/FigureUtils';
import { SpreadCard } from '@/app/common/style/CommonCard.style';
import { LabelText, LabelValueGrid, LabelValueRow, PriceColumn, PriceText } from '@/app/common/style/CommonText.style';
import { styled } from '@mui/material/styles';

interface FigureDetailScheduleProps {
  /** 보여 줄 상품 */
  figure: FigureDetail;
}

/**
 * 일정과 금액 구역. 위는 날짜(값이 있는 것만 2열로), 아래는 총액과 내역(표시 전용).
 */
const FigureDetailSchedule = ({ figure }: FigureDetailScheduleProps) => {
  return (
    <SpreadCard>
      <Dates>
        {figure.reservationDeadline !== '' && (
          <LabelValueRow>
            <Label>예약마감</Label>
            <FigureDeadlineText date={figure.reservationDeadline} passed={isDeadlinePassed(figure, todayString())} />
          </LabelValueRow>
        )}
        {figure.balanceDueDate !== null && (
          <LabelValueRow>
            <Label>잔금 기한</Label>
            <FigureDeadlineText date={figure.balanceDueDate} />
          </LabelValueRow>
        )}
        <LabelValueRow>
          <Label>배송예정</Label>
          <span>{formatDeliveryMonth(figure.deliveryMonth)}</span>
        </LabelValueRow>
        {figure.depositPaidAt !== null && (
          <LabelValueRow>
            <Label>예약금 결제</Label>
            <span>{formatDeadline(figure.depositPaidAt)}</span>
          </LabelValueRow>
        )}
        {figure.paidAt !== null && (
          <LabelValueRow>
            <Label>전액 결제</Label>
            <span>{formatDeadline(figure.paidAt)}</span>
          </LabelValueRow>
        )}
        {figure.deliveredAt !== null && (
          <LabelValueRow>
            <Label>배송완료</Label>
            <span>{formatDeadline(figure.deliveredAt)}</span>
          </LabelValueRow>
        )}
      </Dates>

      <PriceColumn>
        <PriceText size="lg">{formatPrice(getTotalPrice(figure))}</PriceText>
        <Typography variant="mono" color="text.secondary">
          {formatPrice(figure.price)} × {figure.quantity}개
          {figure.depositAmount !== null && ` · 예약금 ${formatPrice(figure.depositAmount)}`}
        </Typography>
      </PriceColumn>
    </SpreadCard>
  );
};

export default FigureDetailSchedule;

/* ───────── styles ───────── */

/* 이름표, 값, 이름표, 값 네 칸. 값이 같은 세로선에서 시작하도록 줄들이 칸을 같이 쓴다(DateRow 는 칸만 거든다) */
const Dates = styled(LabelValueGrid)(({ theme }) => ({
  ...theme.typography.mono,
  gridTemplateColumns: 'auto 1fr auto 1fr',
  rowGap: theme.spacing(0.75),
  marginBottom: theme.spacing(2.5),
  fontWeight: 500,
}));

const Label = styled(LabelText)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: 400,
  whiteSpace: 'nowrap',
}));
