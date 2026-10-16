import { THUMBNAIL_OUTPUT_MAX_SIDE } from '@/app/common/constant/thumbnailFile';
import { BASE_URL } from '@/config/axios/AxiosConfig';

/**
 * 가격 표시 (예: 20000 -> "20,000원")
 */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('ko-KR')}원`;
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
 * 이미지에서 정사각형 영역을 잘라 새 파일로 만든다 (썸네일 위치 조정용).
 * 한 변은 THUMBNAIL_OUTPUT_MAX_SIDE 를 넘지 않게 줄이고, jpg 는 jpg 로, 나머지는 png 로 만든다(움직이는 gif 는 첫 장면 한 장이 된다).
 * 서버가 확장자를 검사하므로 파일 이름의 확장자도 맞춘다.
 */
export const cropSquareFile = (
  image: HTMLImageElement,
  region: { x: number; y: number; side: number },
  original: File,
): Promise<File> => {
  const outSide = Math.min(Math.round(region.side), THUMBNAIL_OUTPUT_MAX_SIDE);
  const canvas = document.createElement('canvas');
  canvas.width = outSide;
  canvas.height = outSide;
  canvas.getContext('2d')?.drawImage(image, region.x, region.y, region.side, region.side, 0, 0, outSide, outSide);

  const isJpeg = original.type === 'image/jpeg';
  const type = isJpeg ? 'image/jpeg' : 'image/png';
  const name = isJpeg ? original.name : `${original.name.replace(/\.[^.]+$/, '')}.png`;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(new File([blob], name, { type })) : reject(new Error('이미지를 자르지 못했어요.'))),
      type,
      0.92,
    );
  });
};
