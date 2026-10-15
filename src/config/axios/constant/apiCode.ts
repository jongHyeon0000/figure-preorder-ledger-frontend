/* 서버 응답 본문의 결과 코드. 성공은 OK, 실패는 서버의 에러 코드 */
export const API_CODE = {
  OK: 'OK',

  /* 아래 넷은 서버가 응답하지 못했을 때 프론트(toApiResponse)가 직접 채우는 코드 */
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
