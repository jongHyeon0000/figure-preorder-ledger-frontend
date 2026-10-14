/*
* 입력 검증. 통과하면 undefined, 틀리면 사용자에게 보여 줄 문구를 돌려준다.
* 제약 값은 백엔드 swagger 기준이고, 서버가 같은 검사를 다시 하므로 여기서는 빠른 안내가 목적이다.
* */

/**
 * 비어 있는지 검사한다 (공백만 있어도 빈 값)
 */
export const validateRequired = (value: string, message: string): string | undefined => {
  return value.trim() === '' ? message : undefined;
};

/**
 * 로그인 아이디: 영문, 숫자 4~30자
 */
export const validateLoginId = (value: string): string | undefined => {
  if (value === '') return '아이디를 입력해 주세요.';
  if (!/^[A-Za-z0-9]{4,30}$/.test(value)) return '아이디는 영문, 숫자 4~30자로 입력해 주세요.';
  return undefined;
};

/**
 * 비밀번호: 8~20자
 */
export const validatePassword = (value: string): string | undefined => {
  if (value === '') return '비밀번호를 입력해 주세요.';
  if (value.length < 8 || value.length > 20) return '비밀번호는 8~20자로 입력해 주세요.';
  return undefined;
};

/**
 * 비밀번호 확인: 비밀번호와 같은지 (화면에서만 쓰고 서버에는 보내지 않는다)
 */
export const validatePasswordConfirm = (password: string, confirm: string): string | undefined => {
  if (confirm === '') return '비밀번호를 한 번 더 입력해 주세요.';
  if (password !== confirm) return '비밀번호가 일치하지 않아요.';
  return undefined;
};

/**
 * 닉네임: 앞뒤 공백을 뺀 1~20자
 */
export const validateName = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (trimmed === '') return '닉네임을 입력해 주세요.';
  if (trimmed.length > 20) return '닉네임은 20자 이하로 입력해 주세요.';
  return undefined;
};

/**
 * 이메일: 이메일 형식, 100자 이하
 */
export const validateEmail = (value: string): string | undefined => {
  if (value.trim() === '') return '이메일을 입력해 주세요.';
  if (value.length > 100) return '이메일은 100자 이하로 입력해 주세요.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '이메일 형식이 올바르지 않아요.';
  return undefined;
};
