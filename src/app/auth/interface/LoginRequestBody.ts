export interface LoginRequestBody {
  /** 로그인 아이디 */
  loginId: string;

  /** 비밀번호 (평문) */
  password: string;
}
