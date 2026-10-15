import type { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AuthCardLayoutProps {
  /** 카드 제목 (예: "로그인") */
  title: string;

  /** 제목 아래 안내 문구 */
  description?: string;

  /** 입력 폼 */
  children: ReactNode;

  /** 카드 아래 안내 (예: 다른 화면으로 가는 링크) */
  footer?: ReactNode;
}

/**
 * 로그인과 회원가입이 같이 쓰는 카드 틀 (화면 가운데에 카드 하나)
 */
const AuthCardLayout = ({ title, description, children, footer }: AuthCardLayoutProps) => {
  return (
    <AuthWrap>
      <AuthCard variant="outlined">
        <Typography variant="h4" color="primary">
          {title}
        </Typography>
        {description && (
          <AuthDescription color="text.secondary">
            {description}
          </AuthDescription>
        )}
        <AuthBody>{children}</AuthBody>
        {footer && <FooterArea>{footer}</FooterArea>}
      </AuthCard>
    </AuthWrap>
  );
};

export default AuthCardLayout;

/* ───────── styles ───────── */

const AuthWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(6, 2),
}));

const AuthCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 440,
  padding: theme.spacing(4),
  borderRadius: 16,
  borderColor: theme.palette.divider,
}));

const FooterArea = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const AuthDescription = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const AuthBody = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));
