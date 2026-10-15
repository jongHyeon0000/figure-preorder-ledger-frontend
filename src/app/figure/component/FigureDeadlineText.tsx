import { styled } from '@mui/material/styles';
import { formatDeadline } from '@/app/figure/utils/FigureUtils';

interface FigureDeadlineTextProps {
  /** 날짜 ("YYYY-MM-DD") */
  date: string;

  /** 기한이 지났으면 빨갛게 */
  passed?: boolean;
}

/**
 * 마감일 값 (예: 26.12.15). 앞의 이름표(예약마감일, 잔금 기한)는 부르는 쪽이 붙인다.
 */
const FigureDeadlineText = ({ date, passed = false }: FigureDeadlineTextProps) => {
  return <DateText passed={passed}>{formatDeadline(date)}</DateText>;
};

export default FigureDeadlineText;

/* ───────── styles ───────── */

const DateText = styled('span', { shouldForwardProp: (prop) => prop !== 'passed' })<{ passed: boolean }>(
  ({ theme, passed }) => ({
    color: passed ? theme.palette.error.main : theme.palette.secondary.main,
    fontWeight: 500,
  }),
);
