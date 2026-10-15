import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import { SectionCard } from '@/app/common/style/CommonCard.style';
import { formatPrice } from '@/app/common/utils/CommonUtils';
import { validateFigurePrice, validateFigureQuantity } from '@/app/common/utils/ValidationUtils';
import type { FigureFormValues } from '@/app/figure/interface/FigureFormValues';

interface FigureFormScheduleProps {
  /** 상품 폼 */
  form: UseFormReturn<FigureFormValues>;
}

/**
 * 일정과 금액 입력. 위는 날짜(예약마감일, 배송예정월), 아래는 개당 가격과 수량, 맨 아래는 총액.
 */
const FigureFormSchedule = ({ form }: FigureFormScheduleProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const [price, quantity] = useWatch({ control, name: ['price', 'quantity'] });

  const isNumber = (value: string) => /^\d+$/.test(value.trim());
  const total = isNumber(price) && isNumber(quantity) ? Number(price) * Number(quantity) : 0;

  return (
    <Card>
      <Pair>
        <Controller
          name="reservationDeadline"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="예약마감일"
              format="YYYY.MM.DD"
              value={field.value}
              onChange={field.onChange}
              slotProps={{ field: { clearable: true }, textField: { onBlur: field.onBlur, inputRef: field.ref } }}
            />
          )}
        />
        <Controller
          name="deliveryMonth"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="배송예정월"
              format="YYYY.MM"
              views={['year', 'month']}
              value={field.value}
              onChange={field.onChange}
              slotProps={{ field: { clearable: true }, textField: { onBlur: field.onBlur, inputRef: field.ref } }}
            />
          )}
        />
      </Pair>

      <Pair>
        <TextField
          label="개당 가격"
          error={!!errors.price}
          helperText={errors.price?.message}
          slotProps={{
            htmlInput: { inputMode: 'numeric' },
            input: { endAdornment: <InputAdornment position="end">원</InputAdornment> },
          }}
          inputRef={register('price', { validate: validateFigurePrice }).ref}
          {...register('price', { validate: validateFigurePrice })}
        />
        <TextField
          label="수량"
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
          slotProps={{
            htmlInput: { inputMode: 'numeric' },
            input: { endAdornment: <InputAdornment position="end">개</InputAdornment> },
          }}
          inputRef={register('quantity', { validate: validateFigureQuantity }).ref}
          {...register('quantity', { validate: validateFigureQuantity })}
        />
      </Pair>

      <Money>
        <Typography variant="caption" color="text.secondary">
          총액 (자동 계산)
        </Typography>
        <Price>{formatPrice(total)}</Price>
      </Money>
    </Card>
  );
};

export default FigureFormSchedule;

/* ───────── styles ───────── */

const Card = styled(SectionCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: theme.spacing(2.5),
}));

const Pair = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
}));

const Money = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

const Price = styled(Typography)(({ theme }) => ({
  ...theme.typography.mono,
  color: theme.palette.primary.main,
  fontSize: '1.9375rem',
  fontWeight: 700,
}));
