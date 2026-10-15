import type { ReactNode } from 'react';
import { Typography } from '@mui/material';
import { StateStack } from '@/app/common/style/CommonState.style';
import { styled } from '@mui/material/styles';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

interface EmptyViewProps {
  /** 보여 줄 문구 (예: "등록된 상품이 없어요") */
  message: string;

  /** 문구 아래에 둘 동작 (예: 등록 버튼) */
  action?: ReactNode;
}

/**
 * 목록이 비었을 때 보여 주는 표시
 */
const EmptyView = ({ message, action }: EmptyViewProps) => {
  return (
    <StateStack>
      <EmptyIcon />
      <Typography color="text.secondary">{message}</Typography>
      {action}
    </StateStack>
  );
};

export default EmptyView;

/* ───────── styles ───────── */

const EmptyIcon = styled(InboxOutlinedIcon)(({ theme }) => ({
  fontSize: '3rem',
  color: theme.palette.text.secondary,
}));
