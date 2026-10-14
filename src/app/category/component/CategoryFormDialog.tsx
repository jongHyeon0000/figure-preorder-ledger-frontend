import { useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { FormBody } from '@/app/common/style/CommonForm.style';
import { imageUrl } from '@/app/common/utils/CommonUtils';
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

  /** 입력이 통과했을 때 (서버 요청은 페이지가 한다) */
  onSubmit: (body: CategorySaveRequestBody) => void;

  /** 닫기 */
  onClose: () => void;
}

/**
 * 분류 추가, 수정 창. 수정일 때는 왼쪽에 썸네일 자리를 보여 준다(올리기와 지우기는 아직 없다).
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

  const actionText = mode === 'insert' ? '추가' : '수정';

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogForm noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {levelName} {actionText}
        </DialogTitle>
        <DialogContent>
          <FormLayout>
            {mode === 'edit' && (
              <ThumbnailBox>
                {target?.thumbnailUrl ? (
                  <ThumbnailImage src={imageUrl(target.thumbnailUrl)} alt={target.name} />
                ) : (
                  <ImageOutlinedIcon color="disabled" fontSize="large" />
                )}
              </ThumbnailBox>
            )}
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
                minRows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
                inputRef={register('description', { validate: validateCategoryDescription }).ref}
                {...register('description', { validate: validateCategoryDescription })}
              />
            </FieldStack>
          </FormLayout>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>닫기</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {actionText}
          </Button>
        </DialogActions>
      </DialogForm>
    </Dialog>
  );
};

export default CategoryFormDialog;

/* ───────── styles ───────── */

const DialogForm = styled(FormBody)({
  gap: 0,
});

const FormLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1),
}));

const ThumbnailBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 120,
  height: 120,
  overflow: 'hidden',
  backgroundColor: theme.palette.surfaceRaised,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
}));

const ThumbnailImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const FieldStack = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: theme.spacing(2),
}));
