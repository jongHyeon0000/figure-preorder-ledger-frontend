import { BASE_URL } from '@/config/axios/AxiosConfig';

/**
 * 가격 표시 (예: 20000 -> "20,000원")
 */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('ko-KR')}원`;
};

/**
 * 날짜 표시 (예: "2026-10-08" -> "2026.10.08")
 */
export const formatDate = (date: string): string => {
  return date.slice(0, 10).replaceAll('-', '.');
};

/**
 * 짧은 날짜 표시 (예: "2026-10-08" -> "10/8")
 */
export const formatDateShort = (date: string): string => {
  const [, month, day] = date.slice(0, 10).split('-');
  return `${Number(month)}/${Number(day)}`;
};

/**
 * 오늘 날짜 (사용자의 시간대 기준, "YYYY-MM-DD")
 */
export const todayString = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

/**
 * 서버가 준 '/uploads/...' 상대 경로를 화면에 그릴 주소로 바꾼다.
 * 저장할 때 쓰는 값(설명 HTML의 src 등)에는 쓰지 않는다. 저장 값은 상대 경로를 그대로 둔다.
 */
export const imageUrl = (path?: string | null): string => {
  if (!path) return '';
  return path.startsWith('/uploads/') ? `${BASE_URL}${path}` : path;
};

/**
 * HTML에 끼워 넣을 문자열 이스케이프 (확인창의 html 옵션에 사용자 입력을 넣을 때)
 */
export const escapeHtml = (value: string): string => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
};
