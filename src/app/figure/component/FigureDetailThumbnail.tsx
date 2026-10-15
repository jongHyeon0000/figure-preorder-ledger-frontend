import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { SectionCard } from '@/app/common/style/CommonCard.style';
import { imageUrl } from '@/app/common/utils/CommonUtils';
import { FIGURE_STATUS_LABELS } from '@/app/figure/constant/figureStatus';
import type { FigureDetail } from '@/app/figure/interface/FigureDetail';

interface FigureDetailThumbnailProps {
  /** 보여 줄 상품 */
  figure: FigureDetail;
}

/**
 * 상품 썸네일 구역. 정사각형 이미지 왼쪽 위에 상태와 결제 방식이 겹쳐 있다(표시 전용).
 */
const FigureDetailThumbnail = ({ figure }: FigureDetailThumbnailProps) => {
  return (
    <SectionCard sx={{ p: 2.5 }}>
      <Frame>
        {figure.thumbnailUrl ? (
          <Image src={imageUrl(figure.thumbnailUrl)} alt={figure.name} />
        ) : (
          <ImageOutlinedIcon color="disabled" sx={{ fontSize: 64 }} />
        )}
        <Badges>
          <StatusBadge>{FIGURE_STATUS_LABELS[figure.status]}</StatusBadge>
          {figure.paymentType && (
            <PaymentBadge>{figure.paymentType === 'FULL' ? '전액' : '예약금형'}</PaymentBadge>
          )}
        </Badges>
      </Frame>
    </SectionCard>
  );
};

export default FigureDetailThumbnail;

/* ───────── styles ───────── */

const Frame = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  backgroundColor: theme.palette.surfaceRaised,
  borderRadius: theme.shape.borderRadius,
}));

const Image = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const Badges = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(0.75),
  left: theme.spacing(0.75),
  display: 'flex',
  gap: theme.spacing(0.5),
}));

const StatusBadge = styled('span')(({ theme }) => ({
  padding: theme.spacing(0.125, 1),
  color: theme.palette.primary.contrastText,
  fontSize: '0.75rem',
  fontWeight: 700,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 999,
}));

const PaymentBadge = styled(StatusBadge)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
  backgroundColor: theme.palette.secondary.main,
}));
