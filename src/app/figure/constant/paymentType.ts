/* 결제 방식. 미구매에서 넘길 때 확정된다 (FULL 전액, DEPOSIT 예약금+잔금) */
export const PAYMENT_TYPES = ['FULL', 'DEPOSIT'] as const;

export type PaymentType = (typeof PAYMENT_TYPES)[number];
