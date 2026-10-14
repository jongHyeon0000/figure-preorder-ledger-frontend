export interface SignupRequestBody {
  /** 로그인 아이디 (영문, 숫자 4~30자, 대소문자 구분) */
  loginId: string;

  /** 이메일 (100자 이하) */
  email: string;

  /** 닉네임 (앞뒤 공백을 뺀 1~20자) */
  name: string;

  /** 비밀번호 (8~20자) */
  password: string;
}
