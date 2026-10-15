import { Backdrop, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

interface LoadingOverlayProps {
  /** 표시 여부 (보통 훅의 xxxLoading 값) */
  open: boolean;
}

/**
 * 화면 전체를 덮는 로딩 표시. 저장, 삭제처럼 끝날 때까지 다른 조작을 막아야 할 때 쓴다.
 */
const LoadingOverlay = ({ open }: LoadingOverlayProps) => {
  return (
    <LoadingBackdrop open={open}>
      <CircularProgress color="primary" />
    </LoadingBackdrop>
  );
};

export default LoadingOverlay;

/* ───────── styles ───────── */

/* 열려 있는 모달 위에 뜨도록 모달 층보다 한 칸 위에 둔다 */
const LoadingBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1,
}));
