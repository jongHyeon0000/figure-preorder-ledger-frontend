import { isAxiosError } from 'axios';
import type { ApiResponse } from '@/config/axios/interface/ApiResponse';

/*
* 서버가 응답 본문 없이 상태 코드만 준 경우(보안 필터의 401/403, 프록시 오류 등)에 채울 값
* */
const fallbackByStatus = (status: number | undefined): { code: string; message: string } => {
  if (status === undefined) return { code: 'NETWORK_ERROR', message: '서버에 연결하지 못했습니다.' };
  if (status === 401) return { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' };
  if (status === 403) return { code: 'FORBIDDEN', message: '접근 권한이 없습니다.' };
  return { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' };
};

/*
* 서버가 준 본문이 { code, ... } 모양인지 확인한다 (JSON이 아닌 오류 페이지 등을 걸러 낸다)
* */
const isApiResponseBody = (body: unknown): body is { code: string; message?: unknown } => {
  return typeof body === 'object' && body !== null && typeof (body as { code?: unknown }).code === 'string';
};

/**
 * 요청 실패(axios 에러)를 ApiResponse 모양으로 바꾼다.
 * 서버가 ApiResponse 본문을 줬으면 그대로 쓰고, 아니면 상태 코드로 채운다.
 */
export const toApiResponse = <T>(err: unknown): ApiResponse<T | null> => {
  if (!isAxiosError(err)) {
    return { ...fallbackByStatus(undefined), data: null };
  }

  const status = err.response?.status;
  const body: unknown = err.response?.data;
  const fallback = fallbackByStatus(status);

  if (isApiResponseBody(body)) {
    return {
      code: body.code,
      message: typeof body.message === 'string' && body.message !== '' ? body.message : fallback.message,
      data: null,
    };
  }

  return { ...fallback, data: null };
};
