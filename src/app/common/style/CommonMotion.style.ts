import type { Variants } from 'motion/react';

/* 카드 진입. 아래에서 위로 떠오르며 나타나고, 줄 순서(index)대로 조금씩 늦게 시작한다(너무 늦지 않게 상한을 둔다) */
const ENTER_DELAY_STEP = 0.07;
const ENTER_DELAY_MAX = 0.7;

export const cardEnterVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 0.61, 0.36, 1],
      delay: Math.min(index * ENTER_DELAY_STEP, ENTER_DELAY_MAX),
    },
  }),
};
