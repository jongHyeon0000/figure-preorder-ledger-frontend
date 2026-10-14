import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatDeadline } from '@/app/figure/utils/FigureUtils';

interface FigureDeadlineTextProps {
  /** 앞에 붙일 이름 (예: "예약마감일", "잔금 기한") */
  label: string;

  /** 날짜 ("YYYY-MM-DD") */
  date: string;

  /** 기한이 지났으면 빨갛게 */
  passed?: boolean;
}

/**
 * 마감일 표시 한 줄 (예: 예약마감일 26.12.15)
 */
const FigureDeadlineText = ({ label, date, passed = false }: FigureDeadlineTextProps) => {
  return (
    <Typography variant="mono" color="text.secondary" noWrap>
      {label} <DateText passed={passed}>{formatDeadline(date)}</DateText>
    </Typography>
  );
};

export default FigureDeadlineText;

/* ───────── styles ───────── */

const DateText = styled('b', { shouldForwardProp: (prop) => prop !== 'passed' })<{ passed: boolean }>(
  ({ theme, passed }) => ({
    color: passed ? theme.palette.error.main : theme.palette.secondary.main,
  }),
);
