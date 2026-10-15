import { imageUrl } from '@/app/common/utils/CommonUtils';
import { FIGURE_STATUS_LABELS } from '@/app/figure/constant/figureStatus';
import type { FigureDetail } from '@/app/figure/interface/FigureDetail';
import { FillImage, StateIcon, ThumbFrame } from '@/app/common/style/CommonMedia.style';
import { MediaCard, Pill } from '@/app/common/style/CommonCard.style';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

interface FigureDetailThumbnailProps {
  /** 보여 줄 상품 */
  figure: FigureDetail;
}

/**
 * 상품 썸네일 구역. 정사각형 이미지 왼쪽 위에 상태와 결제 방식이 겹쳐 있다(표시 전용).
 */
const FigureDetailThumbnail = ({ figure }: FigureDetailThumbnailProps) => {
  return (
    <MediaCard>
      <ThumbFrame>
        {figure.thumbnailUrl ? (
          <FillImage src={imageUrl(figure.thumbnailUrl)} alt={figure.name} />
        ) : (
          <StateIcon size="lg">
            <ImageOutlinedIcon fontSize="inherit" color="disabled" />
          </StateIcon>
        )}
        <Badges>
          <StatusBadge>{FIGURE_STATUS_LABELS[figure.status]}</StatusBadge>
          {figure.paymentType && (
            <PaymentBadge>{figure.paymentType === 'FULL' ? '전액' : '예약금형'}</PaymentBadge>
          )}
        </Badges>
      </ThumbFrame>
    </MediaCard>
  );
};

export default FigureDetailThumbnail;

/* ───────── styles ───────── */

const Badges = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(0.75),
  left: theme.spacing(0.75),
  display: 'flex',
  gap: theme.spacing(0.5),
}));

const StatusBadge = styled(Pill)(({ theme }) => ({
  padding: theme.spacing(0.125, 1),
  color: theme.palette.primary.contrastText,
  fontSize: '0.75rem',
  fontWeight: 700,
  backgroundColor: theme.palette.primary.main,
}));

const PaymentBadge = styled(StatusBadge)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
  backgroundColor: theme.palette.secondary.main,
}));
