import type { SignupFormValues } from '@/app/auth/interface/SignupFormValues';
import { THUMBNAIL_EXTENSIONS, THUMBNAIL_MAX_BYTES } from '@/app/common/constant/thumbnailFile';

/*
* 입력 검증. 통과하면 undefined, 틀리면 사용자에게 보여 줄 문구를 돌려준다.
* 제약 값은 백엔드 swagger 기준이고, 서버가 같은 검사를 다시 하므로 여기서는 빠른 안내가 목적이다.
* 함수마다 첫 줄에 [사용하는 페이지]를 적는다. 페이지별로 파일을 나눌 때 이 표시를 기준으로 옮긴다.
* */

/**
 * [로그인 페이지]
 *
 * 로그인 아이디 입력 확인: 비었는지만 본다 (서버가 로그인 때는 형식을 검사하지 않는다)
 */
export const validateLoginIdRequired = (value: string): string | undefined => {
  if (value.trim() === '') return '아이디를 입력해 주세요.';
  return undefined;
};

/**
 * [로그인 페이지]
 *
 * 로그인 비밀번호 입력 확인: 비었는지만 본다
 */
export const validatePasswordRequired = (value: string): string | undefined => {
  if (value.trim() === '') return '비밀번호를 입력해 주세요.';
  return undefined;
};

/**
 * [회원가입 페이지]
 *
 * 로그인 아이디: 영문, 숫자 4~30자
 */
export const validateLoginId = (value: string): string | undefined => {
  if (value === '') return '아이디를 입력해 주세요.';
  if (!/^[A-Za-z0-9]{4,30}$/.test(value)) return '아이디는 영문, 숫자 4~30자로 입력해 주세요.';
  return undefined;
};

/**
 * [회원가입 페이지]
 *
 * 비밀번호: 8~20자
 */
export const validatePassword = (value: string): string | undefined => {
  if (value === '') return '비밀번호를 입력해 주세요.';
  if (value.length < 8 || value.length > 20) return '비밀번호는 8~20자로 입력해 주세요.';
  return undefined;
};

/**
 * [회원가입 페이지]
 *
 * 비밀번호 확인: 폼의 비밀번호와 같은지 (화면에서만 쓰고 서버에는 보내지 않는다)
 * react-hook-form 의 validate 규칙(값, 폼 전체 값)에 그대로 넘길 수 있다.
 */
export const validatePasswordConfirm = (confirm: string, formValues: SignupFormValues): string | undefined => {
  if (confirm === '') return '비밀번호를 한 번 더 입력해 주세요.';
  if (formValues.password !== confirm) return '비밀번호가 일치하지 않아요.';
  return undefined;
};

/**
 * [회원가입 페이지]
 *
 * 닉네임: 앞뒤 공백을 뺀 1~20자
 */
export const validateName = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (trimmed === '') return '닉네임을 입력해 주세요.';
  if (trimmed.length > 20) return '닉네임은 20자 이하로 입력해 주세요.';
  return undefined;
};

/**
 * [회원가입 페이지]
 *
 * 이메일: 이메일 형식, 100자 이하
 */
export const validateEmail = (value: string): string | undefined => {
  if (value.trim() === '') return '이메일을 입력해 주세요.';
  if (value.length > 100) return '이메일은 100자 이하로 입력해 주세요.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '이메일 형식이 올바르지 않아요.';
  return undefined;
};

/**
 * [카테고리 페이지]
 *
 * 분류 이름: 앞뒤 공백을 뺀 1~100자
 */
export const validateCategoryName = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (trimmed === '') return '이름을 입력해 주세요.';
  if (trimmed.length > 100) return '이름은 100자 이하로 입력해 주세요.';
  return undefined;
};

/**
 * [카테고리 페이지]
 *
 * 분류 설명: 선택 입력, 1000자 이하
 */
export const validateCategoryDescription = (value: string): string | undefined => {
  if (value.length > 1000) return '설명은 1000자 이하로 입력해 주세요.';
  return undefined;
};

/**
 * [카테고리 페이지, 상품 폼]
 *
 * 썸네일 파일: 한 장, 확장자(jpg, jpeg, png, gif, webp), 5MB 이하
 * 고른 파일이나 끌어다 놓은 파일 목록을 그대로 받는다. 파일 내용(실제 이미지인지)은 서버만 검사한다.
 */
export const validateThumbnailFiles = (files: ArrayLike<File>): string | undefined => {
  if (files.length > 1) return '이미지는 한 장만 올릴 수 있어요.';

  const file = files[0];
  const extension = file.name.includes('.') ? (file.name.split('.').pop() ?? '').toLowerCase() : '';
  if (!(THUMBNAIL_EXTENSIONS as readonly string[]).includes(extension)) return 'jpg, png, gif, webp 파일만 올릴 수 있어요.';
  if (file.size > THUMBNAIL_MAX_BYTES) return '5MB 이하의 이미지만 올릴 수 있어요.';
  return undefined;
};
