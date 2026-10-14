import { useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import { FormBody } from '@/app/common/style/CommonForm.style';
import {
  validateEmail,
  validateLoginId,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '@/app/common/utils/ValidationUtils';
import type { SignupFormValues } from '@/app/auth/interface/SignupFormValues';
import type { SignupRequestBody } from '@/app/auth/interface/SignupRequestBody';

interface SignupFormProps {
  /** 입력이 통과했을 때 (서버 요청은 페이지가 한다) */
  onSubmit: (body: SignupRequestBody) => void;

  /** 요청 중이면 버튼을 막는다 */
  loading: boolean;
}

/**
 * 회원가입 입력 폼
 * 칸을 처음 벗어날 때 그 칸을 검사하고, 그 뒤에는 입력할 때마다 다시 검사한다. 제출이 막히면 첫 오류 칸으로 커서가 간다.
 */
const SignupForm = ({ onSubmit, loading }: SignupFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    mode: 'onTouched',
    defaultValues: { loginId: '', email: '', name: '', password: '', passwordConfirm: '' },
  });

  /* 비밀번호 확인은 화면에서만 쓰는 칸이라 서버로 보내는 값에서 뺀다 */
  const handleValid = ({ loginId, email, name, password }: SignupFormValues) => {
    onSubmit({ loginId, email: email.trim(), name: name.trim(), password });
  };

  return (
    <FormBody noValidate onSubmit={handleSubmit(handleValid)}>
      <TextField
        label="아이디"
        autoComplete="username"
        autoFocus
        error={!!errors.loginId}
        helperText={errors.loginId?.message}
        inputRef={register('loginId', { validate: validateLoginId }).ref}
        {...register('loginId', { validate: validateLoginId })}
      />
      <TextField
        label="이메일"
        type="email"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        inputRef={register('email', { validate: validateEmail }).ref}
        {...register('email', { validate: validateEmail })}
      />
      <TextField
        label="닉네임"
        autoComplete="nickname"
        error={!!errors.name}
        helperText={errors.name?.message}
        inputRef={register('name', { validate: validateName }).ref}
        {...register('name', { validate: validateName })}
      />
      <TextField
        label="비밀번호"
        type="password"
        autoComplete="new-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        inputRef={register('password', { validate: validatePassword }).ref}
        {...register('password', { validate: validatePassword })}
      />
      <TextField
        label="비밀번호 확인"
        type="password"
        autoComplete="new-password"
        error={!!errors.passwordConfirm}
        helperText={errors.passwordConfirm?.message}
        inputRef={register('passwordConfirm', { validate: validatePasswordConfirm }).ref}
        {...register('passwordConfirm', { validate: validatePasswordConfirm })}
      />
      <Button type="submit" variant="contained" size="large" disabled={loading}>
        가입하기
      </Button>
    </FormBody>
  );
};

export default SignupForm;