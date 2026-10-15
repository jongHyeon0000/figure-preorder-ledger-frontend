import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ThumbnailUploader from '@/app/common/component/ThumbnailUploader';
import type { ThumbnailChange } from '@/app/common/interface/ThumbnailChange';
import { SectionCard } from '@/app/common/style/CommonCard.style';

interface FigureFormThumbnailProps {
  /** 서버에 이미 올라가 있는 썸네일 주소 (수정일 때) */
  currentUrl?: string | null;

  /** 지금 고른 변경 사항 */
  value: ThumbnailChange;

  /** 변경 사항이 바뀌었을 때 */
  onChange: (change: ThumbnailChange) => void;

  /** 저장 요청 중이면 막는다 */
  disabled: boolean;
}

/**
 * 상품 썸네일 칸. 상세의 썸네일과 같은 정사각형 틀 안에서 이미지를 고르거나 끌어다 놓는다.
 */
const FigureFormThumbnail = ({ currentUrl, value, onChange, disabled }: FigureFormThumbnailProps) => {
  return (
    <SectionCard sx={{ p: 2.5 }}>
      <Frame>
        <ThumbnailUploader currentUrl={currentUrl} value={value} onChange={onChange} disabled={disabled} />
      </Frame>
    </SectionCard>
  );
};

export default FigureFormThumbnail;

/* ───────── styles ───────── */

const Frame = styled(Box)({
  aspectRatio: '1 / 1',
});
