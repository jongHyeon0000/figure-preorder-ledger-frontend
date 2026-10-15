import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { cardEnterVariants } from '@/app/common/style/CommonMotion.style';
import { formatPrice, imageUrl, todayString } from '@/app/common/utils/CommonUtils';
import FigureDeadlineText from '@/app/figure/component/FigureDeadlineText';
import type { FigureSummary } from '@/app/figure/interface/FigureSummary';
import { DEADLINE_BLINK_MONTHS } from '@/app/figure/constant/figureStatus';
import { formatDeliveryMonth, getTotalPrice, isDeadlinePassed, isDeadlineUnder } from '@/app/figure/utils/FigureUtils';
import { LabelText, LabelValueGrid, LabelValueRow, PriceColumn, PriceText, ValueText } from '@/app/common/style/CommonText.style';
import { FillImage, ThumbFrame } from '@/app/common/style/CommonMedia.style';
import { Box, Checkbox, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface FigureListComponentProps {
  /** 보여 줄 상품 */
  figures: FigureSummary[];

  /** 마감이 곧인 미구매 상품의 예약마감일, 예약완료 상품의 잔금 기한을 깜빡이게 할지 */
  blinkUrgent: boolean;

  /** 카드를 눌렀을 때 (선택 모드가 아닐 때). 없으면 카드는 누를 수 없는 표시 전용이다 */
  onOpenDetail?: (figureId: number) => void;

  /** 선택 모드 여부. 켜지면 카드 앞에 체크칸이 생기고 카드를 눌러도 상세로 가지 않는다 */
  selectMode?: boolean;

  /** 선택 모드에서 체크된 상품 id */
  checkedIds?: number[];

  /** 선택 모드에서 카드를 눌렀을 때 체크를 켜고 끈다 */
  onToggle?: (figureId: number) => void;
}

/**
 * 상품 목록. 가로로 긴 티켓형 카드가 세로로 쌓인다(표시 전용).
 */
const FigureListComponent = ({
  figures,
  blinkUrgent,
  onOpenDetail,
  selectMode = false,
  checkedIds = [],
  onToggle,
}: FigureListComponentProps) => {
  const today = todayString();

  const clickable = selectMode || onOpenDetail !== undefined;

  const handleTicketClick = (figureId: number) => (selectMode ? onToggle?.(figureId) : onOpenDetail?.(figureId));

  const handleTicketKeyDown = (e: KeyboardEvent<HTMLDivElement>, figureId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTicketClick(figureId);
    }
  };

  return (
    <ListBox>
      {figures.map((figure, index) => {
        const genre = figure.characters[0].groupName;
        const checked = checkedIds.includes(figure.figureId);

        return (
          <motion.div key={figure.figureId} variants={cardEnterVariants} initial="hidden" animate="visible" custom={index}>
            <Ticket
              checked={selectMode && checked}
              clickable={clickable}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={() => handleTicketClick(figure.figureId)}
              onKeyDown={(e) => handleTicketKeyDown(e, figure.figureId)}
            >
              {selectMode && (
                <Check checked={checked} tabIndex={-1} disableRipple slotProps={{ input: { 'aria-label': `${figure.name} 선택` } }} />
              )}
              <Thumb>
                {figure.thumbnailUrl ? (
                  <FillImage src={imageUrl(figure.thumbnailUrl)} alt={figure.name} />
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
                    <LabelText>장르</LabelText>
                    <ValueText>{genre}</ValueText>
                    <LabelText>형태</LabelText>
                    <ValueText>
                      {figure.figureType.groupName} › {figure.figureType.name}
                    </ValueText>
                  </Rows>
                </Names>
              </Main>

              <Stub>
                <LabelValueGrid>
                  {(figure.status === 'CART' || figure.status === 'UNPURCHASED') && figure.reservationDeadline !== '' && (
                    <LabelValueRow>
                      <LabelText>예약마감일</LabelText>
                      <FigureDeadlineText date={figure.reservationDeadline} passed={isDeadlinePassed(figure, today)}
                        urgent={blinkUrgent && isDeadlineUnder(figure, today, DEADLINE_BLINK_MONTHS)}
                      />
                    </LabelValueRow>
                  )}
                  {figure.status === 'RESERVED' && figure.balanceDueDate !== null && (
                    <LabelValueRow>
                      <LabelText>잔금 기한</LabelText>
                      <FigureDeadlineText
                        date={figure.balanceDueDate}
                        urgent={blinkUrgent && isDeadlineUnder(figure, today, DEADLINE_BLINK_MONTHS)}
                      />
                    </LabelValueRow>
                  )}
                  <LabelValueRow>
                    <LabelText>배송예정월</LabelText>
                    <ValueText>{formatDeliveryMonth(figure.deliveryMonth)}</ValueText>
                  </LabelValueRow>
                </LabelValueGrid>
                <PriceBox>
                  <PriceText>{formatPrice(getTotalPrice(figure))}</PriceText>
                  {figure.quantity > 1 && (
                    <Quantity variant="mono" color="text.secondary" noWrap>
                      {formatPrice(figure.price)} × {figure.quantity}
                    </Quantity>
                  )}
                </PriceBox>
              </Stub>
            </Ticket>
          </motion.div>
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

const Ticket = styled(Box, { shouldForwardProp: (prop) => prop !== 'checked' && prop !== 'clickable' })<{
  checked: boolean;
  clickable: boolean;
}>(({ theme, checked, clickable }) => ({
  display: 'flex',
  alignItems: 'stretch',
  overflow: 'hidden',
  cursor: clickable ? 'pointer' : 'default',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${checked ? theme.palette.primary.main : theme.palette.lineSubtle}`,
  borderRadius: theme.shape.cardRadius,
  transition: 'transform 0.15s ease, border-color 0.15s ease',
  ...(clickable && {
    '&:hover, &:focus-visible': {
      transform: 'translateX(3px)',
      borderColor: theme.palette.primary.main,
      outline: 'none',
    },
  }),
}));

/* 선택 모드의 체크칸. 카드 세로 가운데에 둔다 */
const Check = styled(Checkbox)(({ theme }) => ({
  alignSelf: 'center',
  marginLeft: theme.spacing(1),
}));

const Thumb = styled(ThumbFrame)(({ theme }) => ({
  flex: `0 0 ${theme.spacing(14)}`,
  alignSelf: 'center',
  width: theme.spacing(14),
  height: theme.spacing(14),
  margin: theme.spacing(1.25, 0, 1.25, 1.25),
  borderRadius: 10,
}));

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
const Rows = styled(LabelValueGrid)({
  fontSize: '0.8125rem',
  lineHeight: 1.5,
});

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

const PriceBox = styled(PriceColumn)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Quantity = styled(Typography)({
  fontSize: '0.75rem',
}) as typeof Typography;
