import { motion, useReducedMotion } from 'motion/react';
import { blinkAnimate, blinkTransition } from '@/app/common/style/CommonMotion.style';
import { formatDeadline } from '@/app/figure/utils/FigureUtils';
import { styled } from '@mui/material/styles';

interface FigureDeadlineTextProps {
  /** 날짜 ("YYYY-MM-DD") */
  date: string;

  /** 기한이 지났으면 빨갛게 */
  passed?: boolean;

  /** 마감이 곧이면 깜빡인다 (움직임 줄이기 설정이면 깜빡이지 않는다) */
  urgent?: boolean;
}

/**
 * 마감일 값 (예: 2026.12.15). 앞의 이름표(예약마감일, 잔금 기한)는 부르는 쪽이 붙인다.
 */
const FigureDeadlineText = ({ date, passed = false, urgent = false }: FigureDeadlineTextProps) => {
  const reducedMotion = useReducedMotion();

  return (
    <DateText passed={passed} animate={urgent && !reducedMotion ? blinkAnimate : undefined} transition={blinkTransition}>
      {formatDeadline(date)}
    </DateText>
  );
};

export default FigureDeadlineText;

/* ───────── styles ───────── */

const DateText = styled(motion.span, { shouldForwardProp: (prop) => prop !== 'passed' })<{ passed: boolean }>(
  ({ theme, passed }) => ({
    color: passed ? theme.palette.error.main : theme.palette.secondary.main,
    fontWeight: 500,
  }),
);
