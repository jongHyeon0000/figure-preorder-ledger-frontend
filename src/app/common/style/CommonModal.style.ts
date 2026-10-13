import type { Variants } from 'motion/react';

/*
* 모달 내용이 나타날 때 쓰는 모션 (motion.div 의 variants 로 넘긴다)
* */
export const modalVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } },
};

/*
* 목록 카드가 차례로 떠오르는 모션 (custom 에 순번을 넘긴다)
* */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: Math.min(index, 10) * 0.04, ease: 'easeOut' },
  }),
};
