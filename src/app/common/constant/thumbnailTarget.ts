/*
* 썸네일을 붙일 대상 종류 (서버의 ThumbnailTarget 과 같은 값, 요청 경로에 그대로 들어간다)
* 상품 1개, 분류 9개(제조사 포함), 계정(프로필 이미지)
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
  'user',
] as const;

export type ThumbnailTarget = (typeof THUMBNAIL_TARGETS)[number];
