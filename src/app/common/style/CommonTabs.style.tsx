import { Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';

/*
* 아래에 선이 있는 탭 줄 (분류 축 탭, 마이페이지 탭)
* */
export const UnderlineTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
