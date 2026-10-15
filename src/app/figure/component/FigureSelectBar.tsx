import { Button, Typography } from '@mui/material';
import { TonalButton, TonalDangerButton } from '@/app/common/style/CommonButton.style';
import type { SelectMode } from '@/app/figure/constant/figureSelect';
import { Highlight } from '@/app/common/style/CommonText.style';
import { styled } from '@mui/material/styles';
import { Row } from '@/app/common/style/CommonLayout.style';

interface FigureSelectBarProps {
  /** 켜진 선택 모드. 동작 버튼의 색이 정해진다(상품 관리는 삭제라 경고색) */
  mode: SelectMode;

  /** 체크된 상품 수 */
  checkedCount: number;

  /** 지금 보이는 상품 수 */
  shownCount: number;

  /** 동작 버튼 글자 (예: 삭제, 구매완료로 변경) */
  actionLabel: string;

  /** 전체 선택 (이미 전부 체크돼 있으면 전체 해제) */
  onToggleAll: () => void;

  /** 동작 버튼을 눌렀을 때 */
  onAction: () => void;
}

/**
 * 선택 모드 도구줄 (N개 선택 · 전체 선택 · 동작 버튼). 헤더에서 버튼 묶음의 왼쪽에 놓인다(표시 전용).
 */
const FigureSelectBar = ({ mode, checkedCount, shownCount, actionLabel, onToggleAll, onAction }: FigureSelectBarProps) => {
  const allChecked = shownCount > 0 && checkedCount === shownCount;
  const ActionButton = mode === 'MANAGE' ? TonalDangerButton : TonalButton;

  return (
    <Bar>
      <Typography color="text.secondary" variant="body2">
        <Highlight>{checkedCount}개</Highlight> 선택
      </Typography>
      <Button onClick={onToggleAll} disabled={shownCount === 0}>
        {allChecked ? '전체 해제' : '전체 선택'}
      </Button>
      <ActionButton onClick={onAction} disabled={checkedCount === 0}>
        {actionLabel}
      </ActionButton>
    </Bar>
  );
};

export default FigureSelectBar;

/* ───────── styles ───────── */

const Bar = styled(Row)({
  whiteSpace: 'nowrap',
});
