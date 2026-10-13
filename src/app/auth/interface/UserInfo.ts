export interface UserInfo {
  /** 계정 id */
  userId: number;

  /** 로그인 아이디 (영문, 숫자 4~30자) */
  loginId: string;

  /** 이메일 */
  email: string;

  /** 닉네임 (1~20자) */
  name: string;

  /** 가입 일시 */
  createdAt: string;

  /** 수정 일시 */
  updatedAt: string;
}
