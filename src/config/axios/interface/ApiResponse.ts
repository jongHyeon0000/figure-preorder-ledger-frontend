export interface ApiResponse<T = unknown> {
  /**
   * 결과 코드
   * @example "OK", "VALIDATION_FAILED", "UNAUTHORIZED"
   */
  code: string;

  /**
   * 사용자에게 보여 줄 메시지. 성공 여부는 이 값이 아니라 code로 가린다
   * @example "저장이 완료되었습니다."
   */
  message: string;

  /**
   * 응답 본문. 실패하거나 돌려줄 값이 없으면 null
   */
  data: T;
}
