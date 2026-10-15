import { Box, Button } from '@mui/material';

/* 저장 버튼이 폼 밖(페이지 위쪽)에도 있어서, form 속성으로 이 폼과 이어 준다 */
export const FIGURE_FORM_ID = 'figure-form';

interface FigureFormActionsProps {
  /** 등록인지 수정인지 (저장 버튼 글자) */
  mode: 'insert' | 'edit';

  /** 저장 요청 중이면 저장 버튼을 막는다 */
  saving: boolean;

  /** false 면 취소 버튼만 보여 준다 (폼을 아직 그릴 수 없을 때) */
  showSubmit: boolean;

  /** 취소 */
  onCancel: () => void;
}

/**
 * 취소와 저장(등록, 수정) 버튼. 폼 위쪽과 아래쪽에 같이 둔다.
 */
const FigureFormActions = ({ mode, saving, showSubmit, onCancel }: FigureFormActionsProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button variant="outlined" color="inherit" onClick={onCancel}>
        취소
      </Button>
      {showSubmit && (
        <Button type="submit" form={FIGURE_FORM_ID} variant="contained" disabled={saving}>
          {mode === 'insert' ? '등록' : '수정'}
        </Button>
      )}
    </Box>
  );
};

export default FigureFormActions;
