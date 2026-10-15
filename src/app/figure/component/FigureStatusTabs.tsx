import type { SyntheticEvent } from 'react';
import { Tab, Tabs } from '@mui/material';
import { FIGURE_TABS, type FigureTabKey } from '@/app/figure/constant/figureStatus';
import { styled } from '@mui/material/styles';

interface FigureStatusTabsProps {
  /** 선택한 탭 */
  tab: FigureTabKey;

  /** 탭마다 상품 수 */
  counts: Record<FigureTabKey, number>;

  /** 다른 탭을 눌렀을 때 */
  onChange: (tab: FigureTabKey) => void;
}

/**
 * 상태 탭 (전체 | 장바구니 | 미구매 | 예약완료 | 구매완료 | 배송완료). 탭마다 상품 수가 붙는다.
 */
const FigureStatusTabs = ({ tab, counts, onChange }: FigureStatusTabsProps) => {
  const handleTabChange = (_event: SyntheticEvent, value: FigureTabKey) => onChange(value);

  return (
    <StatusTabs value={tab} onChange={handleTabChange}>
      {FIGURE_TABS.map((config) => {
        const TabItem = config.separated ? SeparatedTab : Tab;
        return (
          <TabItem
            key={config.key}
            value={config.key}
            label={
              <TabLabel>
                {config.label}
                <Count className="tab-count">{counts[config.key]}</Count>
              </TabLabel>
            }
          />
        );
      })}
    </StatusTabs>
  );
};

export default FigureStatusTabs;

/* ───────── styles ───────── */

const StatusTabs = styled(Tabs)(({ theme }) => ({
  /* 고른 탭의 건수 칸만 금색으로 채운다 */
  '& .Mui-selected .tab-count': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

/* 전체 탭: 오른쪽에 점선을 그어 뒤의 탭들과 구분한다 */
const SeparatedTab = styled(Tab)(({ theme }) => ({
  marginRight: theme.spacing(0.75),
  borderRight: `1px dashed ${theme.palette.divider}`,
}));

const TabLabel = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
}));

const Count = styled('span')(({ theme }) => ({
  padding: theme.spacing(0, 0.75),
  borderRadius: 10,
  backgroundColor: theme.palette.surfaceRaised,
  color: theme.palette.text.secondary,
  fontFamily: theme.typography.mono.fontFamily,
  fontSize: '0.7rem',
}));
