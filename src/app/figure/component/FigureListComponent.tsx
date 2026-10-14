import type { KeyboardEvent } from 'react';
import { Box, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { formatPrice, imageUrl, todayString } from '@/app/common/utils/CommonUtils';
import FigureDeadlineText from '@/app/figure/component/FigureDeadlineText';
import FigureStatusChip from '@/app/figure/component/FigureStatusChip';
import type { FigureSummary } from '@/app/figure/interface/FigureSummary';
import { formatDeliveryMonth, getTotalPrice, isDeadlinePassed } from '@/app/figure/utils/FigureUtils';

interface FigureListComponentProps {
  /** 보여 줄 상품 */
  figures: FigureSummary[];

  /** 상태 칩을 보여 줄지 (탭 하나만 볼 때는 모두 같은 상태라 숨긴다) */
  showStatus: boolean;

  /** 카드를 눌렀을 때 */
  onSelect: (figureId: number) => void;
}

/**
 * 상품 목록. 가로로 긴 티켓형 카드가 세로로 쌓인다(표시 전용).
 */
const FigureListComponent = ({ figures, showStatus, onSelect }: FigureListComponentProps) => {
  const today = todayString();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, figureId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(figureId);
    }
  };

  return (
    <ListBox>
      {figures.map((figure) => {
        const genre = figure.characters[0]?.groupName ?? '';
        const seriesLine = [...figure.series, ...figure.characters].map((ref) => ref.name).join(' · ');
        const makerLine = [figure.maker?.name, figure.shop?.name].filter(Boolean).join(' · ');

        return (
          <Ticket
            key={figure.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(figure.id)}
            onKeyDown={(e) => handleKeyDown(e, figure.id)}
          >
            <Thumb>
              {figure.thumbnailUrl ? (
                <ThumbImage src={imageUrl(figure.thumbnailUrl)} alt={figure.name} />
              ) : (
                <ImageOutlinedIcon color="disabled" fontSize="large" />
              )}
            </Thumb>

            <Main>
              <Tags>
                {genre !== '' && <GoldTag>{genre}</GoldTag>}
                {figure.figureType && <PinkTag>{figure.figureType.name}</PinkTag>}
              </Tags>
              <Names>
                <NameRow>
                  <FigureName variant="h6" component="div">
                    {figure.name}
                  </FigureName>
                  {showStatus && <FigureStatusChip status={figure.status} />}
                </NameRow>
                {seriesLine !== '' && (
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {seriesLine}
                  </Typography>
                )}
                {makerLine !== '' && (
                  <Typography variant="mono" color="text.secondary" noWrap>
                    {makerLine}
                  </Typography>
                )}
              </Names>
            </Main>

            <Stub>
              {(figure.status === 'CART' || figure.status === 'UNPURCHASED') && figure.reservationDeadline !== '' && (
                <FigureDeadlineText label="예약마감일" date={figure.reservationDeadline} passed={isDeadlinePassed(figure, today)} />
              )}
              {figure.status === 'RESERVED' && figure.balanceDueDate !== null && (
                <FigureDeadlineText label="잔금 기한" date={figure.balanceDueDate} />
              )}
              <Typography variant="mono" color="text.secondary" noWrap>
                배송예정월 <b>{formatDeliveryMonth(figure.deliveryMonth)}</b>
              </Typography>
              <Price>{formatPrice(getTotalPrice(figure))}</Price>
              {figure.quantity > 1 && (
                <Typography variant="mono" color="text.secondary" noWrap>
                  {formatPrice(figure.price)} × {figure.quantity}
                </Typography>
              )}
            </Stub>
          </Ticket>
        );
      })}
    </ListBox>
  );
};

export default FigureListComponent;

/* ───────── styles ───────── */

const ListBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
}));

const Ticket = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  overflow: 'hidden',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.lineSubtle}`,
  borderRadius: 12,
  transition: 'transform 0.15s ease, border-color 0.15s ease',
  '&:hover, &:focus-visible': {
    transform: 'translateX(3px)',
    borderColor: theme.palette.primary.main,
    outline: 'none',
  },
}));

const Thumb = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: `0 0 ${theme.spacing(14)}`,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  width: theme.spacing(14),
  height: theme.spacing(14),
  margin: theme.spacing(1.25, 0, 1.25, 1.25),
  overflow: 'hidden',
  backgroundColor: theme.palette.surfaceRaised,
  borderRadius: 10,
}));

const ThumbImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const Main = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  minWidth: 0,
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 2.5),
}));

const Tags = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: `0 0 ${theme.spacing(11.5)}`,
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

/* 장르(금색)와 형태(분홍색) 꼬리표 */
const GoldTag = styled('span')(({ theme }) => ({
  ...theme.typography.mono,
  padding: theme.spacing(0.25, 0.75),
  overflow: 'hidden',
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.14),
  borderRadius: 5,
}));

const PinkTag = styled(GoldTag)(({ theme }) => ({
  color: theme.palette.secondary.main,
  backgroundColor: alpha(theme.palette.secondary.main, 0.14),
}));

const Names = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  minWidth: 0,
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const NameRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const FigureName = styled(Typography)({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
}) as typeof Typography;

/* 티켓 오른쪽의 점선으로 끊긴 칸 (마감일, 배송예정월, 가격) */
const Stub = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flex: `0 0 ${theme.spacing(25)}`,
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.spacing(0.75),
  padding: theme.spacing(1.75, 2.5),
  backgroundColor: theme.palette.surfaceRaised,
  borderLeft: `1px dashed ${theme.palette.divider}`,
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    left: -7,
    width: 14,
    height: 14,
    backgroundColor: theme.palette.background.default,
    borderRadius: '50%',
  },
  '&::before': { top: -7 },
  '&::after': { bottom: -7 },
}));

const Price = styled(Typography)(({ theme }) => ({
  ...theme.typography.mono,
  fontSize: '1rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
}));
