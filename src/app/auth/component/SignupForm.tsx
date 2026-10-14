import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, TextField } from '@mui/material';
import { FormBody } from '@/app/common/style/CommonForm.style';
import {
  validateEmail,
  validateLoginId,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '@/app/common/utils/ValidationUtils';
import type { SignupRequestBody } from '@/app/auth/interface/SignupRequestBody';

interface SignupFormProps {
  /** 입력이 통과했을 때 (서버 요청은 페이지가 한다) */
  onSubmit: (body: SignupRequestBody) => void;

  /** 요청 중이면 버튼을 막는다 */
  loading: boolean;
}

/* 비밀번호 확인은 화면에서만 쓰는 칸이라 서버로 보내는 값(SignupRequestBody)에는 없다 */
type SignupField = keyof SignupRequestBody | 'passwordConfirm';
type SignupValues = Record<SignupField, string>;

/* 입력칸 목록 (위에서부터 보이는 순서) */
const FIELDS: { name: SignupField; label: string; type?: string; autoComplete: string }[] = [
  { name: 'loginId', label: '아이디', autoComplete: 'username' },
  { name: 'email', label: '이메일', type: 'email', autoComplete: 'email' },
  { name: 'name', label: '닉네임', autoComplete: 'nickname' },
  { name: 'password', label: '비밀번호', type: 'password', autoComplete: 'new-password' },
  { name: 'passwordConfirm', label: '비밀번호 확인', type: 'password', autoComplete: 'new-password' },
];

const INITIAL_VALUES: SignupValues = { loginId: '', email: '', name: '', password: '', passwordConfirm: '' };
const NOT_TOUCHED: Record<SignupField, boolean> = {
  loginId: false,
  email: false,
  name: false,
  password: false,
  passwordConfirm: false,
};

/**
 * 회원가입 입력 폼
 * 칸을 벗어날 때 그 칸의 오류를 보여 주고, 가입 버튼을 누르면 모든 칸을 검사한다.
 */
const SignupForm = ({ onSubmit, loading }: SignupFormProps) => {
  const [values, setValues] = useState<SignupValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Record<SignupField, boolean>>(NOT_TOUCHED);

  /* 오류는 저장하지 않고 입력값으로 매번 계산한다 (고치면 문구가 바로 사라진다) */
  const errors: Record<SignupField, string | undefined> = {
    loginId: validateLoginId(values.loginId),
    email: validateEmail(values.email),
    name: validateName(values.name),
    password: validatePassword(values.password),
    passwordConfirm: validatePasswordConfirm(values.password, values.passwordConfirm),
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: SignupField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched({ loginId: true, email: true, name: true, password: true, passwordConfirm: true });
    if (Object.values(errors).some(Boolean)) return;

    onSubmit({
      loginId: values.loginId,
      email: values.email.trim(),
      name: values.name.trim(),
      password: values.password,
    });
  };

  return (
    <FormBody noValidate onSubmit={handleSubmit}>
      {FIELDS.map((field, index) => (
        <TextField
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type}
          autoComplete={field.autoComplete}
          autoFocus={index === 0}
          value={values[field.name]}
          onChange={handleChange}
          onBlur={() => handleBlur(field.name)}
          error={touched[field.name] && !!errors[field.name]}
          helperText={touched[field.name] ? errors[field.name] : undefined}
        />
      ))}
      <Button type="submit" variant="contained" size="large" disabled={loading}>
        가입하기
      </Button>
    </FormBody>
  );
};

export default SignupForm;
