import type { SyntheticEvent } from 'react';
import { Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CATEGORY_AXES, isCategoryAxisKey, type CategoryAxisKey } from '@/app/category/constant/categoryAxes';

interface CategoryAxisTabsProps {
  /** 지금 보고 있는 축 */
  axis: CategoryAxisKey;

  /** 다른 축의 탭을 눌렀을 때 */
  onChange: (axis: CategoryAxisKey) => void;
}

/**
 * 분류 축 탭 (판매처, 형태, 시리즈, 장르·캐릭터, 제조사)
 */
const CategoryAxisTabs = ({ axis, onChange }: CategoryAxisTabsProps) => {
  const handleChange = (_event: SyntheticEvent, value: string) => {
    if (isCategoryAxisKey(value)) onChange(value);
  };

  return (
    <AxisTabs value={axis} onChange={handleChange}>
      {Object.entries(CATEGORY_AXES).map(([key, config]) => (
        <Tab key={key} value={key} label={config.nameKr} />
      ))}
    </AxisTabs>
  );
};

export default CategoryAxisTabs;

/* ───────── styles ───────── */

const AxisTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
