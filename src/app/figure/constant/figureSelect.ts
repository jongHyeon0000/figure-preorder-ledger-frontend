/* 목록 선택 모드. MANAGE 는 상품 관리(삭제), STATUS 는 상태 변경(일괄). 평소는 모드 없음(null) */
export const SELECT_MODES = ['MANAGE', 'STATUS'] as const;

export type SelectMode = (typeof SELECT_MODES)[number];
