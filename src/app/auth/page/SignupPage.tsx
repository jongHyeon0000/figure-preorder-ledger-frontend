import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import AuthCardLayout from '@/app/auth/component/AuthCardLayout';
import SignupForm from '@/app/auth/component/SignupForm';
import type { SignupRequestBody } from '@/app/auth/interface/SignupRequestBody';
import useAuth from '@/app/auth/service/useAuth';
import useSignup from '@/app/auth/service/useSignup';
import LoadingOverlay from '@/app/common/component/loading/LoadingOverlay';
import { API_CODE } from '@/config/axios/constant/apiCode';
import { useUiStore } from '@/store/uiStore';

/**
 * 회원가입 화면
 * 가입에 성공하면 로그인 화면으로 보낸다. 이미 로그인한 상태면 /figures 로 보낸다.
 */
const SignupPage = () => {
  const { isAuthenticated } = useAuth();
  const { signupLoading, fetchSignup } = useSignup();
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/figures" replace />;

  const handleSubmit = async (body: SignupRequestBody) => {
    const res = await fetchSignup(body);

    if (res.code === API_CODE.OK) {
      showSnackbar(res.message, 'success');
      navigate('/login');
    } else {
      showSnackbar(res.message, 'error');
    }
  };

  return (
    <>
      <AuthCardLayout
        title="회원가입"
        description="아이디와 비밀번호로 계정을 만들어요."
        footer={
          <>
            이미 계정이 있으신가요?{' '}
            <Link component={RouterLink} to="/login">
              로그인
            </Link>
          </>
        }
      >
        <SignupForm onSubmit={handleSubmit} loading={signupLoading} />
      </AuthCardLayout>
      <LoadingOverlay open={signupLoading} />
    </>
  );
};

export default SignupPage;
