import { Chip } from '@mui/material';
import { alpha, styled, type Theme } from '@mui/material/styles';
import { FIGURE_STATUS_LABELS, type FigureStatus } from '@/app/figure/constant/figureStatus';

interface FigureStatusChipProps {
  /** 보여 줄 상태 */
  status: FigureStatus;
}

/* 상태마다 쓰는 색 (흐름이 진행될수록 장바구니 회색 → 미구매 주황 → 예약완료 파랑 → 구매완료 초록 → 배송완료 금색) */
const getStatusColor = (theme: Theme, status: FigureStatus): string => {
  switch (status) {
    case 'CART':
      return theme.palette.text.secondary;
    case 'UNPURCHASED':
      return theme.palette.warning.main;
    case 'RESERVED':
      return theme.palette.info.main;
    case 'PURCHASED':
      return theme.palette.success.main;
    case 'DELIVERED':
      return theme.palette.primary.main;
  }
};

/**
 * 상품 상태 칩
 */
const FigureStatusChip = ({ status }: FigureStatusChipProps) => {
  return <StatusChip size="small" status={status} label={FIGURE_STATUS_LABELS[status]} />;
};

export default FigureStatusChip;

/* ───────── styles ───────── */

const StatusChip = styled(Chip, { shouldForwardProp: (prop) => prop !== 'status' })<{ status: FigureStatus }>(
  ({ theme, status }) => ({
    fontWeight: 700,
    color: getStatusColor(theme, status),
    backgroundColor: alpha(getStatusColor(theme, status), 0.18),
  }),
);
