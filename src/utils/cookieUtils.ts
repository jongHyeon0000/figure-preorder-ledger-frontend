import Cookies from 'js-cookie';

/**
 * Access Token을 저장할 쿠키 키 이름
 */
const ACCESS_TOKEN_KEY = 'accessToken';

/**
 * 쿠키에 Access Token 저장
 *
 * @param token - JWT Access Token
 * @param expiresInHours - 만료 시간 (기본 24시간, 백엔드 JWT 유효 시간과 같다)
 */
export const setAccessToken = (token: string, expiresInHours: number = 24): void => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: expiresInHours / 24, // js-cookie는 일(day) 단위
    secure: import.meta.env.PROD, // prod 빌드에서만 https 전용
    sameSite: 'Strict',
  });
};

/**
 * 쿠키에서 Access Token 읽기
 *
 * @returns Access Token 또는 undefined
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

/**
 * 쿠키에서 Access Token 삭제
 */
export const removeAccessToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY);
};
