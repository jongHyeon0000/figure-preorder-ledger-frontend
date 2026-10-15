import { useForm } from 'react-hook-form';
import { Alert, TextField } from '@mui/material';
import { TonalDangerButton } from '@/app/common/style/CommonButton.style';
import { ColumnCard } from '@/app/common/style/CommonCard.style';
import { EndRow } from '@/app/common/style/CommonLayout.style';
import { FormBody } from '@/app/common/style/CommonForm.style';
import { validatePasswordRequired } from '@/app/common/utils/ValidationUtils';
import type { WithdrawRequestBody } from '@/app/auth/interface/WithdrawRequestBody';

interface WithdrawFormProps {
  /** 탈퇴 요청 중이면 버튼을 막는다 */
  loading: boolean;

  /** 비밀번호 입력이 통과했을 때. 확인창과 서버 요청은 페이지가 한다 */
  onSubmit: (body: WithdrawRequestBody) => void;
}

/**
 * 회원 탈퇴 탭. 경고 글과 비밀번호 확인 칸.
 */
const WithdrawForm = ({ loading, onSubmit }: WithdrawFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WithdrawRequestBody>({
    mode: 'onTouched',
    defaultValues: { password: '' },
  });

  return (
    <ColumnCard>
      <FormBody noValidate onSubmit={handleSubmit(onSubmit)}>
        <Alert severity="warning">탈퇴하면 등록한 상품, 분류, 이미지가 모두 삭제되고 되돌릴 수 없어요.</Alert>
        <TextField
          label="비밀번호 확인"
          type="password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          inputRef={register('password', { validate: validatePasswordRequired }).ref}
          {...register('password', { validate: validatePasswordRequired })}
        />
        <EndRow>
          <TonalDangerButton type="submit" disabled={loading}>
            회원 탈퇴
          </TonalDangerButton>
        </EndRow>
      </FormBody>
    </ColumnCard>
  );
};

export default WithdrawForm;
