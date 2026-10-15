import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  Alert,
  Button,
  Dialog,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TonalButton } from '@/app/common/style/CommonButton.style';
import { formatPrice } from '@/app/common/utils/CommonUtils';
import { validateDepositAmount, validateStatusDate } from '@/app/common/utils/ValidationUtils';
import { FIGURE_STATUS_LABELS } from '@/app/figure/constant/figureStatus';
import type { FigureTransition } from '@/app/figure/constant/figureTransition';
import type { FigureStatusFormValues } from '@/app/figure/interface/FigureStatusFormValues';
import { toStatusFormValues } from '@/app/figure/utils/FigureTransitionUtils';

interface FigureStatusModalProps {
  /** 창 제목 (예: "구매완료로 변경") */
  title: string;

  /** 고를 수 있는 전이. 하나면 바꿀 상태 고르기는 보이지 않는다 */
  transitions: FigureTransition[];

  /** 예약금의 상한인 상품 총액(원). 일괄 변경은 예약금이 없어 0 */
  totalPrice: number;

  /** 저장 요청 중이면 버튼을 막는다 */
  loading: boolean;

  /** 입력이 통과했을 때. 확인창과 서버 요청은 페이지가 한다 */
  onSubmit: (transition: FigureTransition, values: FigureStatusFormValues) => void;

  /** 닫기 */
  onClose: () => void;
}

/**
 * 상태 변경 창 (일괄, 개별 공용). 바꿀 상태에 따라 입력칸이 달라진다:
 * 예약완료는 예약금, 예약금 결제일, 잔금 기한(선택), 나머지는 날짜 하나, 날짜가 없는 전이는 안내 글만 보인다.
 * 열릴 때마다 새로 그려지므로 defaultValues 가 그때의 값으로 들어간다.
 */
const FigureStatusModal = ({ title, transitions, totalPrice, loading, onSubmit, onClose }: FigureStatusModalProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FigureStatusFormValues>({
    mode: 'onTouched',
    defaultValues: toStatusFormValues(transitions, totalPrice),
  });

  const nextStatus = useWatch({ control, name: 'nextStatus' });
  const transition = transitions.find((candidate) => candidate.next === nextStatus)!;

  const handleValid = (values: FigureStatusFormValues) => onSubmit(transition, values);

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      scroll="body"
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit(handleValid) } }}
    >
      <Stack spacing={3} sx={{ p: 3 }}>
        <DialogTitle sx={{ p: 0 }}>{title}</DialogTitle>
        <Stack spacing={3}>
          {transitions.length > 1 && (
            <Controller
              name="nextStatus"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  value={field.value}
                  onChange={(_event, value) => value !== null && field.onChange(value)}
                >
                  {transitions.map((candidate) => (
                    <ToggleButton key={candidate.next} value={candidate.next}>
                      {FIGURE_STATUS_LABELS[candidate.next]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              )}
            />
          )}

          {transitions.length === 1 && transition.paymentType === 'FULL' && (
            <Alert severity="warning">
              미구매 상품은 모두 <b>전액 결제(구매완료)</b>로 처리돼요. 예약금으로 구매한 상품은 상세 화면에서 예약완료로 바꿔 주세요.
            </Alert>
          )}

          {transition.next === 'RESERVED' && (
            <TextField
              label="예약금"
              autoFocus
              error={!!errors.depositAmount}
              helperText={errors.depositAmount?.message ?? `총액 ${formatPrice(totalPrice)} 이하`}
              slotProps={{
                htmlInput: { inputMode: 'numeric' },
                input: { endAdornment: <InputAdornment position="end">원</InputAdornment> },
              }}
              inputRef={register('depositAmount', { validate: validateDepositAmount }).ref}
              {...register('depositAmount', { validate: validateDepositAmount })}
            />
          )}

          {transition.dateField !== null && (
            <Controller
              name="date"
              control={control}
              rules={{ validate: validateStatusDate }}
              render={({ field, fieldState }) => (
                <DatePicker
                  label={transition.dateLabel}
                  format="YYYY.MM.DD"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                      onBlur: field.onBlur,
                      inputRef: field.ref,
                    },
                  }}
                />
              )}
            />
          )}

          {transition.next === 'RESERVED' && (
            <Controller
              name="balanceDueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="잔금 기한 (선택)"
                  format="YYYY.MM.DD"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{ field: { clearable: true }, textField: { onBlur: field.onBlur, inputRef: field.ref } }}
                />
              )}
            />
          )}

          {transition.dateField === null && (
            <Typography color="text.secondary">입력할 값은 없어요. 변경하면 {FIGURE_STATUS_LABELS[transition.next]} 상태가 돼요.</Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <TonalButton onClick={onClose}>닫기</TonalButton>
          <Button type="submit" variant="contained" disabled={loading}>
            변경
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default FigureStatusModal;
