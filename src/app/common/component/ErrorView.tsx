import { Button, Stack, Typography } from '@mui/material';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';

interface ErrorViewProps {
  /** 보여 줄 메시지 (보통 ApiResponse 의 message) */
  message: string;

  /** 다시 시도 버튼을 눌렀을 때 (없으면 버튼을 숨긴다) */
  onRetry?: () => void;
}

/**
 * 조회에 실패했을 때 화면 자리에 보여 주는 표시
 */
const ErrorView = ({ message, onRetry }: ErrorViewProps) => {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', py: 8 }}>
      <ErrorOutlinedIcon color="error" sx={{ fontSize: 48 }} />
      <Typography color="text.secondary">{message}</Typography>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </Stack>
  );
};

export default ErrorView;
