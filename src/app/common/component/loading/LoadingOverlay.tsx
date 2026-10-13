import { Backdrop, CircularProgress } from '@mui/material';

interface LoadingOverlayProps {
  /** 표시 여부 (보통 훅의 xxxLoading 값) */
  open: boolean;
}

/**
 * 화면 전체를 덮는 로딩 표시. 저장, 삭제처럼 끝날 때까지 다른 조작을 막아야 할 때 쓴다.
 */
const LoadingOverlay = ({ open }: LoadingOverlayProps) => {
  return (
    <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export default LoadingOverlay;
