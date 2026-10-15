import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TonalDangerButton } from '@/app/common/style/CommonButton.style';

interface FigureSelectBarProps {
  /** 체크된 상품 수 */
  checkedCount: number;

  /** 지금 보이는 상품 수 */
  shownCount: number;

  /** 전체 선택 (이미 전부 체크돼 있으면 전체 해제) */
  onToggleAll: () => void;

  /** 삭제를 눌렀을 때 */
  onDelete: () => void;

  /** 선택 모드를 끝낸다 */
  onCancel: () => void;
}

/**
 * 선택 모드 도구줄 (N개 선택 · 전체 선택 · 삭제 · 취소). 탭 줄 오른쪽에서 결과 요약 자리를 대신한다(표시 전용).
 */
const FigureSelectBar = ({ checkedCount, shownCount, onToggleAll, onDelete, onCancel }: FigureSelectBarProps) => {
  const allChecked = shownCount > 0 && checkedCount === shownCount;

  return (
    <Bar>
      <Typography color="text.secondary" variant="body2">
        <Strong>{checkedCount}개</Strong> 선택
      </Typography>
      <Button onClick={onToggleAll} disabled={shownCount === 0}>
        {allChecked ? '전체 해제' : '전체 선택'}
      </Button>
      <TonalDangerButton onClick={onDelete} disabled={checkedCount === 0}>
        삭제
      </TonalDangerButton>
      <Button color="inherit" onClick={onCancel}>
        취소
      </Button>
    </Bar>
  );
};

export default FigureSelectBar;

/* ───────── styles ───────── */

const Bar = styled('div')(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingBottom: theme.spacing(0.75),
  whiteSpace: 'nowrap',
}));

const Strong = styled('b')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
}));
