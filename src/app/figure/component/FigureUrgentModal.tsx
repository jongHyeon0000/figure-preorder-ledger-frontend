import { useState } from 'react';
import { Box, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { TonalButton } from '@/app/common/style/CommonButton.style';
import FigureListComponent from '@/app/figure/component/FigureListComponent';
import type { FigureSummary } from '@/app/figure/interface/FigureSummary';
import { Row } from '@/app/common/style/CommonLayout.style';
import { BoldText } from '@/app/common/style/CommonText.style';
import { styled } from '@mui/material/styles';

interface FigureUrgentModalProps {
  /** 예약마감일이 곧인 미구매 상품 */
  figures: FigureSummary[];

  /** 닫을 때. dismiss 가 true 면 "새로고침 전까지 다시 보지 않기"를 체크하고 닫은 것이다 */
  onClose: (dismiss: boolean) => void;
}

/**
 * 마감 임박 알림 모달. 목록과 같은 카드를 누를 수 없는 표시 전용으로 보여 준다.
 */
const FigureUrgentModal = ({ figures, onClose }: FigureUrgentModalProps) => {
  const [dismiss, setDismiss] = useState<boolean>(false);

  return (
    <Dialog open onClose={() => onClose(dismiss)} fullWidth maxWidth="md">
      <Header>
        <Row>
          <NotificationsActiveIcon color="error" />
          <UrgentTitle>곧 품절될 가능성이 높은 제품이 있어요!</UrgentTitle>
        </Row>
        <BoldText color="text.secondary">예약마감일이 얼마 남지 않은 미구매 항목이에요. 서둘러 확인해보세요.</BoldText>
      </Header>
      <Content>
        <FigureListComponent figures={figures} blinkUrgent />
      </Content>
      <DialogActions>
        <FormControlLabel
          control={<Checkbox checked={dismiss} onChange={(e) => setDismiss(e.target.checked)} />}
          label="새로고침 전까지 다시 보지 않기"
        />
        <TonalButton onClick={() => onClose(dismiss)}>닫기</TonalButton>
      </DialogActions>
    </Dialog>
  );
};

export default FigureUrgentModal;

/* ───────── styles ───────── */

/* 제목 줄과 부제목을 세로로 쌓고 왼쪽 정렬한다 */
const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  rowGap: theme.spacing(0.75),
  padding: theme.spacing(2, 3, 0),
}));

const UrgentTitle = styled(DialogTitle)(({ theme }) => ({
  padding: 0,
  color: theme.palette.error.main,
}));

/* 부제목과 첫 카드 사이, 마지막 카드와 아래 버튼 줄 사이를 좁힌다 */
const Content = styled(DialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(0.5),
}));
