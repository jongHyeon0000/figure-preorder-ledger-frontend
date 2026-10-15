import { Link as RouterLink, Navigate, useLocation, type Location } from 'react-router-dom';
import { Link } from '@mui/material';
import AuthCardLayout from '@/app/auth/component/AuthCardLayout';
import LoginForm from '@/app/auth/component/LoginForm';
import type { LoginRequestBody } from '@/app/auth/interface/LoginRequestBody';
import useAuth from '@/app/auth/service/useAuth';
import LoadingOverlay from '@/app/common/component/loading/LoadingOverlay';
import { API_CODE } from '@/config/axios/constant/apiCode';
import { useUiStore } from '@/store/uiStore';

/**
 * 로그인 화면
 * 이미 로그인한 상태이거나 로그인에 성공하면, 가려던 주소(RequireAuth 가 넘긴 from)로, 없으면 /figures 로 이동한다.
 */
const LoginPage = () => {
  const { isAuthenticated, login, loginLoading } = useAuth();
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const location = useLocation();

  const from = (location.state as { from?: Location } | null)?.from;
  const redirectTo = from ? `${from.pathname}${from.search}` : '/figures';

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (body: LoginRequestBody) => {
    const res = await login(body);

    if (res.code === API_CODE.OK) {
      showSnackbar(res.message, 'success');
    } else {
      showSnackbar(res.message, 'error');
    }
  };

  return (
    <>
      <AuthCardLayout
        title="로그인"
        description="피규어 예약 장부에 오신 것을 환영해요."
        footer={
          <>
            아직 계정이 없으신가요?{' '}
            <Link component={RouterLink} to="/signup">
              회원가입
            </Link>
          </>
        }
      >
        <LoginForm onSubmit={handleSubmit} loading={loginLoading} />
      </AuthCardLayout>
      <LoadingOverlay open={loginLoading} />
    </>
  );
};

export default LoginPage;
