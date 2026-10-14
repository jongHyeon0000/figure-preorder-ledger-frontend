import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, TextField } from '@mui/material';
import { FormBody } from '@/app/common/style/CommonForm.style';
import { validateRequired } from '@/app/common/utils/ValidationUtils';
import type { LoginRequestBody } from '@/app/auth/interface/LoginRequestBody';

interface LoginFormProps {
  /** 입력이 통과했을 때 (서버 요청은 페이지가 한다) */
  onSubmit: (body: LoginRequestBody) => void;

  /** 요청 중이면 버튼을 막는다 */
  loading: boolean;
}

type LoginField = keyof LoginRequestBody;

/**
 * 로그인 입력 폼. 서버가 로그인 때는 형식을 검사하지 않으므로 비었는지만 확인한다.
 */
const LoginForm = ({ onSubmit, loading }: LoginFormProps) => {
  const [values, setValues] = useState<LoginRequestBody>({ loginId: '', password: '' });
  const [touched, setTouched] = useState<Record<LoginField, boolean>>({ loginId: false, password: false });

  const errors: Record<LoginField, string | undefined> = {
    loginId: validateRequired(values.loginId, '아이디를 입력해 주세요.'),
    password: validateRequired(values.password, '비밀번호를 입력해 주세요.'),
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  /* 칸을 벗어나면 그 칸의 오류를 보여 준다 */
  const handleBlur = (field: LoginField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched({ loginId: true, password: true });
    if (errors.loginId || errors.password) return;
    onSubmit(values);
  };

  return (
    <FormBody noValidate onSubmit={handleSubmit}>
      <TextField
        name="loginId"
        label="아이디"
        autoComplete="username"
        autoFocus
        value={values.loginId}
        onChange={handleChange}
        onBlur={() => handleBlur('loginId')}
        error={touched.loginId && !!errors.loginId}
        helperText={touched.loginId ? errors.loginId : undefined}
      />
      <TextField
        name="password"
        label="비밀번호"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        onBlur={() => handleBlur('password')}
        error={touched.password && !!errors.password}
        helperText={touched.password ? errors.password : undefined}
      />
      <Button type="submit" variant="contained" size="large" disabled={loading}>
        로그인
      </Button>
    </FormBody>
  );
};

export default LoginForm;
