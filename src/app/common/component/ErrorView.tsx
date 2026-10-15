import { Button, Typography } from '@mui/material';
import { StateStack } from '@/app/common/style/CommonState.style';
import { styled } from '@mui/material/styles';
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
    <StateStack>
      <ErrorIcon color="error" />
      <Typography color="text.secondary">{message}</Typography>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </StateStack>
  );
};

export default ErrorView;

/* ───────── styles ───────── */

const ErrorIcon = styled(ErrorOutlinedIcon)({
  fontSize: '3rem',
});
