/*
* 썸네일을 붙일 대상 종류 (서버의 ThumbnailTarget 과 같은 값, 요청 경로에 그대로 들어간다)
* 상품 1개와 분류 9개(제조사 포함)
* */
export const THUMBNAIL_TARGETS = [
  'figure',
  'shop-group',
  'shop',
  'figure-type-group',
  'figure-type',
  'series-group',
  'series',
  'genre-character-group',
  'genre-character',
  'maker',
] as const;

export type ThumbnailTarget = (typeof THUMBNAIL_TARGETS)[number];
