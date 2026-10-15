import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import ThumbnailUploader from '@/app/common/component/ThumbnailUploader';
import type { ThumbnailChange } from '@/app/common/interface/ThumbnailChange';
import { TonalButton } from '@/app/common/style/CommonButton.style';
import { FormBody } from '@/app/common/style/CommonForm.style';
import { validateCategoryDescription, validateCategoryName } from '@/app/common/utils/ValidationUtils';
import type { CategoryItem } from '@/app/category/interface/CategoryItem';
import type { CategorySaveRequestBody } from '@/app/category/interface/CategorySaveRequestBody';

interface CategoryFormDialogProps {
  /** 추가인지 수정인지 */
  mode: 'insert' | 'edit';

  /** 제목에 쓸 단계 이름 (예: "판매처 채널") */
  levelName: string;

  /** 수정할 분류 (수정일 때만) */
  target?: CategoryItem;

  /** 저장 요청 중이면 버튼을 막는다 */
  loading: boolean;

  /** 입력이 통과했을 때. 고른 썸네일 변경 사항도 같이 넘긴다 (서버 요청은 페이지가 한다) */
  onSubmit: (body: CategorySaveRequestBody, thumbnail: ThumbnailChange) => void;

  /** 닫기 */
  onClose: () => void;
}

/**
 * 분류 추가, 수정 창. 왼쪽 썸네일 칸에서 이미지를 고르거나 끌어다 놓는다.
 * 고른 이미지는 저장 버튼을 누를 때 이름, 설명과 함께 페이지가 서버에 보낸다.
 * 열릴 때마다 새로 그려지므로 defaultValues 가 그때의 값으로 들어간다.
 */
const CategoryFormDialog = ({ mode, levelName, target, loading, onSubmit, onClose }: CategoryFormDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategorySaveRequestBody>({
    mode: 'onTouched',
    defaultValues: { name: target?.name ?? '', description: target?.description ?? '' },
  });

  const [thumbnail, setThumbnail] = useState<ThumbnailChange>({ type: 'none' });

  const actionText = mode === 'insert' ? '추가' : '수정';

  const handleValid = (body: CategorySaveRequestBody) => onSubmit(body, thumbnail);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogForm noValidate onSubmit={handleSubmit(handleValid)}>
        <DialogTitle>
          {levelName} {actionText}
        </DialogTitle>
        <DialogContent>
          <FormLayout>
            <ThumbnailBox>
              <ThumbnailUploader currentUrl={target?.thumbnailUrl} value={thumbnail} onChange={setThumbnail} disabled={loading} />
            </ThumbnailBox>
            <FieldStack>
              <TextField
                label="이름"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
                inputRef={register('name', { validate: validateCategoryName }).ref}
                {...register('name', { validate: validateCategoryName })}
              />
              <TextField
                label="설명 (선택)"
                multiline
                minRows={5}
                maxRows={5}
                error={!!errors.description}
                helperText={errors.description?.message}
                inputRef={register('description', { validate: validateCategoryDescription }).ref}
                {...register('description', { validate: validateCategoryDescription })}
              />
            </FieldStack>
          </FormLayout>
        </DialogContent>
        <FormActions>
          <TonalButton onClick={onClose}>닫기</TonalButton>
          <Button type="submit" variant="contained" disabled={loading}>
            {actionText}
          </Button>
        </FormActions>
      </DialogForm>
    </Dialog>
  );
};

export default CategoryFormDialog;

/* ───────── styles ───────── */

const DialogForm = styled(FormBody)({
  gap: 0,
});

/* 버튼 줄. 기본 여백이 좁아서 오른쪽과 아래를 넓힌다 */
const FormActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(1, 2, 2),
}));

const FormLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1),
}));

/* 썸네일 칸의 크기. 높이는 오른쪽 입력칸 높이를 따라가고(설명칸 줄 수를 고정해 둠), 너비는 그 높이와 비슷하게 rem 으로 정한다 */
const ThumbnailBox = styled(Box)({
  flexShrink: 0,
  width: '13.75rem',
});

const FieldStack = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: theme.spacing(2),
}));
