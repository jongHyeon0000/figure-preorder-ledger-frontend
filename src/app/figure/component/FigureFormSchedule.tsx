import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatPrice } from '@/app/common/utils/CommonUtils';
import { validateFigurePrice, validateFigureQuantity } from '@/app/common/utils/ValidationUtils';
import type { FigureFormValues } from '@/app/figure/interface/FigureFormValues';
import { SpreadCard } from '@/app/common/style/CommonCard.style';
import { PriceColumn, PriceText } from '@/app/common/style/CommonText.style';
import { styled } from '@mui/material/styles';

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
    setValue,
    formState: { errors },
  } = form;
  const [price, quantity] = useWatch({ control, name: ['price', 'quantity'] });

  const isNumber = (value: string) => /^\d+$/.test(value.trim());
  const total = isNumber(price) && isNumber(quantity) ? Number(price) * Number(quantity) : 0;

  return (
    <SpreadCard>
      <Pair>
        <Controller
          name="reservationDeadline"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="예약마감일"
              format="YYYY.MM.DD"
              value={field.value}
              onChange={(date) => {
                field.onChange(date);
                /* 예약마감일을 바꿀 때마다 배송예정월을 다음 달로 맞춘다 (그 뒤에 배송예정월을 직접 바꿀 수 있다) */
                if (date?.isValid()) setValue('deliveryMonth', date.add(1, 'month'));
              }}
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

      <PriceColumn>
        <Typography variant="caption" color="text.secondary">
          총액 (자동 계산)
        </Typography>
        <PriceText size="lg">{formatPrice(total)}</PriceText>
      </PriceColumn>
    </SpreadCard>
  );
};

export default FigureFormSchedule;

/* ───────── styles ───────── */

const Pair = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
}));
