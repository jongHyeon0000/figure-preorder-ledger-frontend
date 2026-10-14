import { useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { FormBody } from '@/app/common/style/CommonForm.style';
import { validateLoginIdRequired, validatePasswordRequired } from '@/app/common/utils/ValidationUtils';
import type { LoginRequestBody } from '@/app/auth/interface/LoginRequestBody';

interface LoginFormProps {
  /** 입력이 통과했을 때 (서버 요청은 페이지가 한다) */
  onSubmit: (body: LoginRequestBody) => void;

  /** 요청 중이면 버튼을 막는다 */
  loading: boolean;
}

/**
 * 로그인 입력 폼. 서버가 로그인 때는 형식을 검사하지 않으므로 비었는지만 확인한다.
 */
const LoginForm = ({ onSubmit, loading }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestBody>({
    mode: 'onTouched',
    defaultValues: { loginId: '', password: '' },
  });

  return (
    <FormBody noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="아이디"
        autoComplete="username"
        autoFocus
        error={!!errors.loginId}
        helperText={errors.loginId?.message}
        inputRef={register('loginId', { validate: validateLoginIdRequired }).ref}
        {...register('loginId', { validate: validateLoginIdRequired })}
      />
      <TextField
        label="비밀번호"
        type="password"
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        inputRef={register('password', { validate: validatePasswordRequired }).ref}
        {...register('password', { validate: validatePasswordRequired })}
      />
      <Button type="submit" variant="contained" size="large" disabled={loading}>
        로그인
      </Button>
    </FormBody>
  );
};

export default LoginForm;
