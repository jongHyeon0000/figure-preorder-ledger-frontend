import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { THUMBNAIL_ACCEPT } from '@/app/common/constant/thumbnailFile';
import type { ThumbnailChange } from '@/app/common/interface/ThumbnailChange';
import { imageUrl } from '@/app/common/utils/CommonUtils';
import { validateThumbnailFiles } from '@/app/common/utils/ValidationUtils';

interface ThumbnailUploaderProps {
  /** 서버에 이미 올라가 있는 썸네일 주소 ('/uploads/...'). 없으면 null */
  currentUrl?: string | null;

  /** 지금 고른 변경 사항 */
  value: ThumbnailChange;

  /** 변경 사항이 바뀌었을 때 (서버에는 폼의 저장 버튼에서 보낸다) */
  onChange: (change: ThumbnailChange) => void;

  /** 저장 요청 중이면 막는다 */
  disabled?: boolean;
}

/**
 * 썸네일 칸. 눌러서 파일을 고르거나, 파일을 끌어다 놓아서 고른다.
 * 고른 파일은 미리 보여 주기만 하고 서버에는 보내지 않는다(올리기와 지우기는 폼의 저장 버튼이 한다).
 * 크기는 부모가 정한다(부모 칸을 가득 채운다).
 */
const ThumbnailUploader = ({ currentUrl, value, onChange, disabled = false }: ThumbnailUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* 보여 줄 그림: 새로 고른 파일 > 서버에 있는 썸네일(지우기로 했으면 없음) */
  const shownUrl =
    value.type === 'upload' ? value.previewUrl : value.type === 'none' && currentUrl ? imageUrl(currentUrl) : null;

  const handleFiles = (files: ArrayLike<File>) => {
    if (files.length === 0) return;

    const message = validateThumbnailFiles(files);
    if (message) {
      setErrorMessage(message);
      return;
    }

    setErrorMessage(null);
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => onChange({ type: 'upload', file, previewUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files ?? []);
    /* 같은 파일을 다시 골라도 change 가 일어나도록 비운다 */
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  /* 새로 고른 파일이면 고른 것을 취소하고, 서버에 있는 썸네일이면 지우기로 표시한다 */
  const handleRemove = () => {
    setErrorMessage(null);
    onChange(value.type === 'upload' ? { type: 'none' } : { type: 'delete' });
  };

  const placeholderText = value.type === 'delete' ? '저장하면 이미지가 지워져요' : '이미지를 끌어다 놓거나 눌러서 선택';

  return (
    <Wrapper>
      <DropZone
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="썸네일 이미지 선택"
        dragging={dragging}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {shownUrl ? (
          <Preview src={shownUrl} alt="썸네일" />
        ) : (
          <Placeholder>
            <ImageOutlinedIcon color="disabled" fontSize="large" />
            <Typography variant="caption" color="text.secondary">
              {placeholderText}
            </Typography>
          </Placeholder>
        )}
        {shownUrl && !disabled && (
          <Tooltip title="이미지 지우기">
            <RemoveButton
              size="small"
              aria-label="이미지 지우기"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </RemoveButton>
          </Tooltip>
        )}
      </DropZone>
      {errorMessage && (
        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>
      )}
      <input ref={inputRef} type="file" accept={THUMBNAIL_ACCEPT} hidden onChange={handleInputChange} />
    </Wrapper>
  );
};

export default ThumbnailUploader;

/* ───────── styles ───────── */

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  width: '100%',
  height: '100%',
}));

/* 끌어서 올려 놓는 동안(dragging)에는 테두리가 금색 점선으로 바뀐다 */
const DropZone = styled(Box, { shouldForwardProp: (prop) => prop !== 'dragging' })<{ dragging: boolean }>(
  ({ theme, dragging }) => ({
    position: 'relative',
    flex: 1,
    minHeight: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: dragging ? alpha(theme.palette.primary.main, 0.12) : theme.palette.surfaceRaised,
    border: `1px ${dragging ? 'dashed' : 'solid'} ${dragging ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: 12,
    '&:hover': { borderColor: theme.palette.primary.main },
  }),
);

const Preview = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const Placeholder = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  textAlign: 'center',
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: theme.palette.error.main,
  backgroundColor: alpha(theme.palette.background.default, 0.75),
  '&:hover': { backgroundColor: alpha(theme.palette.background.default, 0.95) },
}));
