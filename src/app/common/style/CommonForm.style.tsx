import { Box, DialogActions, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

/*
* <form> 본체 (입력칸을 세로로 쌓는다)
* */
export const FormBody = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

/*
* 폼 모달의 <form> 본체 (제목, 내용, 버튼 줄이 MUI 기본 간격 그대로 붙도록 칸 사이 간격을 없앤다)
* */
export const DialogFormBody = styled(FormBody)({
  gap: 0,
});

/*
* 입력칸을 세로로 쌓는 칸 (칸 사이 간격은 같은 값)
* */
export const FieldStack = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

/*
* 폼 모달 내용 안의 입력칸 쌓기 (첫 칸의 라벨이 제목에 가려지지 않도록 위쪽을 조금 띄운다)
* */
export const DialogFieldStack = styled(FieldStack)(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

/*
* 폼 모달의 버튼 줄. 기본 여백이 좁아서 오른쪽과 아래를 넓힌다
* */
export const FormActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(1, 2, 2),
}));

/*
* 같은 폭의 토글 버튼 묶음 (가장 긴 글자에 맞춰 버튼들이 같은 폭이 되고, 높이는 옆 칸과 나란히 늘어난다)
* */
export const EqualToggleGroup = styled(ToggleButtonGroup)({
  display: 'inline-grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  flexShrink: 0,
  whiteSpace: 'nowrap',
});
