export interface LoginResponseData {
  /** 이후 요청의 Authorization: Bearer 헤더에 쓸 JWT (24시간 유효) */
  accessToken: string;
}
