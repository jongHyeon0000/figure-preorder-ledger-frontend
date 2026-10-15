import type { KeyboardEvent } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { formatPrice, imageUrl, todayString } from '@/app/common/utils/CommonUtils';
import FigureDeadlineText from '@/app/figure/component/FigureDeadlineText';
import type { FigureSummary } from '@/app/figure/interface/FigureSummary';
import { formatDeliveryMonth, getTotalPrice, isDeadlinePassed } from '@/app/figure/utils/FigureUtils';

interface FigureListComponentProps {
  /** 보여 줄 상품 */
  figures: FigureSummary[];

  /** 카드를 눌렀을 때 */
  onSelect: (figureId: number) => void;
}

/**
 * 상품 목록. 가로로 긴 티켓형 카드가 세로로 쌓인다(표시 전용).
 */
const FigureListComponent = ({ figures, onSelect }: FigureListComponentProps) => {
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
        const genre = figure.characters[0].groupName;

        return (
          <Ticket
            key={figure.figureId}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(figure.figureId)}
            onKeyDown={(e) => handleKeyDown(e, figure.figureId)}
          >
            <Thumb>
              {figure.thumbnailUrl ? (
                <ThumbImage src={imageUrl(figure.thumbnailUrl)} alt={figure.name} />
              ) : (
                <ImageOutlinedIcon color="disabled" fontSize="large" />
              )}
            </Thumb>

            <Main>
              <Names>
                <FigureName variant="h6" component="div">
                  {figure.name}
                </FigureName>
                <Rows>
                  <Label>장르</Label>
                  <Value>{genre}</Value>
                  <Label>형태</Label>
                  <Value>
                    {figure.figureType.groupName} › {figure.figureType.name}
                  </Value>
                </Rows>
              </Names>
            </Main>

            <Stub>
              <Dates>
                {(figure.status === 'CART' || figure.status === 'UNPURCHASED') && figure.reservationDeadline !== '' && (
                  <StubRow>
                    <Label>예약마감일</Label>
                    <FigureDeadlineText date={figure.reservationDeadline} passed={isDeadlinePassed(figure, today)} />
                  </StubRow>
                )}
                {figure.status === 'RESERVED' && figure.balanceDueDate !== null && (
                  <StubRow>
                    <Label>잔금 기한</Label>
                    <FigureDeadlineText date={figure.balanceDueDate} />
                  </StubRow>
                )}
                <StubRow>
                  <Label>배송예정월</Label>
                  <Value>{formatDeliveryMonth(figure.deliveryMonth)}</Value>
                </StubRow>
              </Dates>
              <PriceBox>
                <Price>{formatPrice(getTotalPrice(figure))}</Price>
                {figure.quantity > 1 && (
                  <Quantity variant="mono" color="text.secondary" noWrap>
                    {formatPrice(figure.price)} × {figure.quantity}
                  </Quantity>
                )}
              </PriceBox>
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
  padding: theme.spacing(1.75, 2.75),
}));

const Names = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  minWidth: 0,
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const FigureName = styled(Typography)({
  display: '-webkit-box',
  overflow: 'hidden',
  fontSize: '1.375rem',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
}) as typeof Typography;

/* 이름표(Label)와 값(Value)이 두 줄로 선 칸. 이름표 칸 폭은 가장 긴 이름표를 따른다 */
const Rows = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: theme.spacing(1.5),
  rowGap: theme.spacing(0.5),
  alignItems: 'baseline',
  fontSize: '0.8125rem',
  lineHeight: 1.5,
}));

const Label = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const Value = styled('span')(({ theme }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: theme.palette.text.primary,
  fontWeight: 500,
}));

/* 티켓 오른쪽의 점선으로 끊긴 칸. 위는 날짜들, 아래는 가격이고 둘 사이를 띄운다 */
const Stub = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flex: `0 0 ${theme.spacing(27)}`,
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(1.75, 2.75),
  fontSize: '0.8125rem',
  lineHeight: 1.5,
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

const Dates = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const StubRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
}));

const PriceBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  marginTop: theme.spacing(2),
}));

const Price = styled(Typography)(({ theme }) => ({
  ...theme.typography.mono,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

const Quantity = styled(Typography)({
  fontSize: '0.75rem',
}) as typeof Typography;
