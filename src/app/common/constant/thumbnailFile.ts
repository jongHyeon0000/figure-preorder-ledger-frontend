/* 서버가 받는 썸네일 파일 규칙 (확장자와 용량은 서버도 검사하고, 파일 내용은 서버만 검사한다) */

/** 올릴 수 있는 확장자 (소문자) */
export const THUMBNAIL_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'] as const;

/** 최대 용량 (5MB) */
export const THUMBNAIL_MAX_BYTES = 5 * 1024 * 1024;

/** 파일 선택 창에서 보여 줄 파일 종류 (<input accept>) */
export const THUMBNAIL_ACCEPT = THUMBNAIL_EXTENSIONS.map((extension) => `.${extension}`).join(',');

/** 위치 조정에서 늘릴 수 있는 최대 배율 (1배는 틀을 꽉 채우는 크기) */
export const THUMBNAIL_MAX_ZOOM = 3;

/** 잘라낸 썸네일의 한 변 최대 크기 (px). 용량 상한을 넘지 않게 한다 */
export const THUMBNAIL_OUTPUT_MAX_SIDE = 1024;
