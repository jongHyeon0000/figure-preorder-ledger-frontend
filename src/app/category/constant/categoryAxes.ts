import type { ThumbnailTarget } from '@/app/common/constant/thumbnailTarget';

/** 분류 축 (화면 탭 하나). 주소의 ?axis= 값으로도 쓴다 */
export type CategoryAxisKey = 'shop' | 'figure-type' | 'series' | 'genre-character' | 'maker';

/** 분류 단계. group 은 상위, child 는 하위 */
export type CategoryLevel = 'group' | 'child';

/** 분류 한 단계(상위 또는 하위)의 서버 연결 정보 */
export interface CategoryLevelConfig {
  /** 목록, 추가 주소 (수정, 삭제, 영향 상품 수는 뒤에 /{id} 를 붙인다) */
  path: string;

  /** 썸네일 올리기와 지우기 주소에 들어가는 대상 종류 */
  thumbnailTarget: ThumbnailTarget;
}

/** 분류 축 하나의 설정 */
export interface CategoryAxisConfig {
  /** 탭에 보여 줄 이름 */
  nameKr: string;

  /** 상위 */
  group: CategoryLevelConfig;

  /** 하위. 제조사처럼 하위가 없는 축은 null */
  child: CategoryLevelConfig | null;
}

/*
* 백엔드는 분류 9개 테이블 컨트롤러가 따로 있지만 주소 모양이 같아서 축 설정 하나로 처리한다.
* 제조사는 상위 자리에 제조사 자체를 두고 child 를 null 로 둔다.
* */
export const CATEGORY_AXES: Record<CategoryAxisKey, CategoryAxisConfig> = {
  shop: {
    nameKr: '판매처',
    group: { path: '/api/shop-group', thumbnailTarget: 'shop-group' },
    child: { path: '/api/shop', thumbnailTarget: 'shop' },
  },
  'figure-type': {
    nameKr: '형태',
    group: { path: '/api/figure-type-group', thumbnailTarget: 'figure-type-group' },
    child: { path: '/api/figure-type', thumbnailTarget: 'figure-type' },
  },
  series: {
    nameKr: '시리즈',
    group: { path: '/api/series-group', thumbnailTarget: 'series-group' },
    child: { path: '/api/series', thumbnailTarget: 'series' },
  },
  'genre-character': {
    nameKr: '장르·캐릭터',
    group: { path: '/api/genre-character-group', thumbnailTarget: 'genre-character-group' },
    child: { path: '/api/genre-character', thumbnailTarget: 'genre-character' },
  },
  maker: {
    nameKr: '제조사',
    group: { path: '/api/maker', thumbnailTarget: 'maker' },
    child: null,
  },
};

/** 주소에 축이 없거나 알 수 없는 값이면 처음 보여 줄 축 */
export const DEFAULT_CATEGORY_AXIS: CategoryAxisKey = 'shop';

/** 서버가 이름 변경과 삭제를 막아 둔 기본 분류의 이름 */
export const PROTECTED_CATEGORY_NAME = '기타';

/** 주소의 ?axis= 값이 축 이름인지 확인 */
export const isCategoryAxisKey = (value: string | null): value is CategoryAxisKey => {
  return value !== null && value in CATEGORY_AXES;
};
