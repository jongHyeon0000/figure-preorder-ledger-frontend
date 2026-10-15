import { Alert, Snackbar } from '@mui/material';
import { useUiStore } from '@/store/uiStore';

/**
 * 루트에 하나만 둔다. uiStore 의 showSnackbar 로 띄운 알림을 그린다.
 * 성공이 아닌 알림(경고, 오류)은 읽을 시간이 필요해서 성공보다 오래 둔다.
 */
const GlobalSnackbar = () => {
  const open = useUiStore((state) => state.snackbarOpen);
  const message = useUiStore((state) => state.snackbarMessage);
  const severity = useUiStore((state) => state.snackbarSeverity);
  const closeSnackbar = useUiStore((state) => state.closeSnackbar);

  const handleClose = (_event?: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    closeSnackbar();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={severity === 'success' ? 3000 : 5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert variant="filled" severity={severity} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
