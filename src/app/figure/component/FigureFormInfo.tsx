import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';
import { Box, FormHelperText, InputBase, TextField, ToggleButton } from '@mui/material';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { validateFigureMultiSelection, validateFigureName, validateFigureSelection } from '@/app/common/utils/ValidationUtils';
import { InfoGroup } from '@/app/figure/style/FigureInfo.style';
import FigurePickField from '@/app/figure/component/FigurePickField';
import { FIGURE_REGISTER_STATUSES, FIGURE_STATUS_LABELS } from '@/app/figure/constant/figureStatus';
import type { FigureFormOptions } from '@/app/figure/interface/FigureFormOptions';
import type { FigureFormValues } from '@/app/figure/interface/FigureFormValues';
import type { FigurePickItem } from '@/app/figure/interface/FigurePickItem';
import { toGroupPickItems, toPickItems } from '@/app/figure/utils/FigureUtils';
import { ColumnCard } from '@/app/common/style/CommonCard.style';
import { EqualToggleGroup } from '@/app/common/style/CommonForm.style';
import { styled } from '@mui/material/styles';

interface FigureFormInfoProps {
  /** 상품 폼 */
  form: UseFormReturn<FigureFormValues>;

  /** 분류 선택지 */
  options: FigureFormOptions;

  /** 등록이면 상태(장바구니/미구매)를 고르는 칸을 보여 준다 */
  showStatus: boolean;
}

/* 고른 id 에 해당하는 항목을 고른 순서대로 */
const pickChips = (all: FigurePickItem[], ids: (number | null)[]): FigurePickItem[] => {
  return ids.flatMap((id) => all.filter((item) => item.id === id));
};

/**
 * 상품 정보 입력. 상품명(등록이면 상태 포함), 분류(장르·캐릭터, 형태, 판매처, 제조사, 시리즈), 구매 링크.
 * 장르(상위)를 먼저 골라야 그 장르의 캐릭터(하위)를 고를 수 있다.
 */
const FigureFormInfo = ({ form, options, showStatus }: FigureFormInfoProps) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;

  /* 캐릭터를 고르는 범위가 되는 장르 */
  const genreId = useWatch({ control, name: 'genreId' });

  const genres = toGroupPickItems(options.genres);
  const allCharacters = toPickItems(options.genres);
  const types = toPickItems(options.types);
  const shops = toPickItems(options.shops);
  const makers = toGroupPickItems(options.makers);
  const series = toPickItems(options.series);

  return (
    <ColumnCard>
      <Box>
        <NameLine>
          <TextField
            label="상품명"
            fullWidth
            autoFocus
            error={!!errors.name}
            inputRef={register('name', { validate: validateFigureName }).ref}
            {...register('name', { validate: validateFigureName })}
          />
          {showStatus && (
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <EqualToggleGroup
                  exclusive
                  color="primary"
                  value={field.value}
                  onChange={(_, next) => next !== null && field.onChange(next)}
                >
                  {FIGURE_REGISTER_STATUSES.map((status) => (
                    <ToggleButton key={status} value={status}>
                      {FIGURE_STATUS_LABELS[status]}
                    </ToggleButton>
                  ))}
                </EqualToggleGroup>
              )}
            />
          )}
        </NameLine>
        {errors.name && (
          <FormHelperText error variant="outlined">
            {errors.name.message}
          </FormHelperText>
        )}
      </Box>

      <InfoGroup>
        <Controller
          name="genreId"
          control={control}
          rules={{ validate: validateFigureSelection }}
          render={({ field, fieldState }) => (
            <FigurePickField
              label="장르"
              dialogTitle="장르 추가"
              chips={pickChips(genres, [field.value])}
              pool={genres}
              multiple={false}
              errorMessage={fieldState.error?.message}
              onChange={(ids) => {
                const genreId = ids[0] ?? null;
                if (genreId !== field.value) setValue('characterIds', []);
                field.onChange(genreId);
              }}
            />
          )}
        />
        <Controller
          name="characterIds"
          control={control}
          rules={{ validate: validateFigureMultiSelection }}
          render={({ field, fieldState }) => (
            <FigurePickField
              label="캐릭터"
              dialogTitle="캐릭터 추가"
              chips={pickChips(allCharacters, field.value)}
              pool={allCharacters.filter((character) => character.groupId === genreId)}
              multiple
              disabled={genreId === null}
              errorMessage={fieldState.error?.message}
              onChange={field.onChange}
            />
          )}
        />
      </InfoGroup>

      <InfoGroup>
        <Controller
          name="figureTypeId"
          control={control}
          rules={{ validate: validateFigureSelection }}
          render={({ field, fieldState }) => (
            <FigurePickField
              label="형태"
              dialogTitle="형태 추가"
              chips={pickChips(types, [field.value])}
              pool={types}
              multiple={false}
              showGroup
              errorMessage={fieldState.error?.message}
              onChange={(ids) => field.onChange(ids[0] ?? null)}
            />
          )}
        />
      </InfoGroup>

      <InfoGroup>
        <Controller
          name="shopId"
          control={control}
          rules={{ validate: validateFigureSelection }}
          render={({ field, fieldState }) => (
            <FigurePickField
              label="판매처"
              dialogTitle="판매처 추가"
              chips={pickChips(shops, [field.value])}
              pool={shops}
              multiple={false}
              showGroup
              errorMessage={fieldState.error?.message}
              onChange={(ids) => field.onChange(ids[0] ?? null)}
            />
          )}
        />
      </InfoGroup>

      <InfoGroup>
        <Controller
          name="makerId"
          control={control}
          rules={{ validate: validateFigureSelection }}
          render={({ field, fieldState }) => (
            <FigurePickField
              label="제조사"
              dialogTitle="제조사 추가"
              chips={pickChips(makers, [field.value])}
              pool={makers}
              multiple={false}
              errorMessage={fieldState.error?.message}
              onChange={(ids) => field.onChange(ids[0] ?? null)}
            />
          )}
        />
      </InfoGroup>

      <InfoGroup>
        <Controller
          name="seriesIds"
          control={control}
          rules={{ validate: validateFigureMultiSelection }}
          render={({ field, fieldState }) => (
            <FigurePickField
              label="시리즈"
              dialogTitle="시리즈 추가"
              chips={pickChips(series, field.value)}
              pool={series}
              multiple
              errorMessage={fieldState.error?.message}
              onChange={field.onChange}
            />
          )}
        />
      </InfoGroup>

      <LinkBar>
        <LinkOutlinedIcon fontSize="small" color="disabled" />
        <InputBase
          fullWidth
          placeholder="구매 링크"
          inputRef={register('purchaseLink').ref}
          {...register('purchaseLink')}
        />
      </LinkBar>
    </ColumnCard>
  );
};

export default FigureFormInfo;

/* ───────── styles ───────── */

const NameLine = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  gap: theme.spacing(2),
}));

/* 구매 링크 띠 (상세의 구매 링크 띠와 같은 모양, 입력칸이 들어 있다). 카드가 길어져도 맨 아래에 붙는다 */
const LinkBar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginTop: 'auto',
  padding: theme.spacing(0.5, 2),
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: 12,
  '&:focus-within': { borderColor: theme.palette.primary.main },
}));
