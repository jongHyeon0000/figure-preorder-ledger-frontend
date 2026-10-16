import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent, type PointerEvent } from 'react';
import { Box, IconButton, Slider, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import { THUMBNAIL_ACCEPT, THUMBNAIL_MAX_ZOOM } from '@/app/common/constant/thumbnailFile';
import type { ThumbnailChange } from '@/app/common/interface/ThumbnailChange';
import { cropSquareFile, imageUrl } from '@/app/common/utils/CommonUtils';
import { validateThumbnailFiles } from '@/app/common/utils/ValidationUtils';
import { FillImage } from '@/app/common/style/CommonMedia.style';
import { alpha, styled } from '@mui/material/styles';

/* 위치 조정 중인 원본 그림 */
interface CropSource {
  image: HTMLImageElement;
  /** 화면에 보여 주는 원본의 data 주소 */
  src: string;
  /** 고른 원본 파일 (잘라낸 파일의 이름과 종류를 정할 때 쓴다) */
  file: File;
}

/* 보이는 영역. zoom 1배는 틀을 꽉 채우는 크기이고, cx/cy 는 영역의 가운데를 그림 전체의 0~1 위치로 나타낸 값 */
interface CropView {
  zoom: number;
  cx: number;
  cy: number;
}

const CENTER_VIEW: CropView = { zoom: 1, cx: 0.5, cy: 0.5 };
const ZOOM_STEP = 0.5;

/* 보이는 영역의 한 변 (그림 px). 1배일 때는 그림의 짧은 변과 같다 */
const visibleSide = (image: HTMLImageElement, zoom: number): number =>
  Math.min(image.naturalWidth, image.naturalHeight) / zoom;

/* 배율은 1~최대 안으로, 영역은 그림 밖으로 나가지 않게 맞춘다 */
const clampView = (image: HTMLImageElement, view: CropView): CropView => {
  const zoom = Math.min(THUMBNAIL_MAX_ZOOM, Math.max(1, view.zoom));
  const halfX = visibleSide(image, zoom) / 2 / image.naturalWidth;
  const halfY = visibleSide(image, zoom) / 2 / image.naturalHeight;
  return {
    zoom,
    cx: Math.min(1 - halfX, Math.max(halfX, view.cx)),
    cy: Math.min(1 - halfY, Math.max(halfY, view.cy)),
  };
};

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
 * 고른 뒤에는 틀 안에서 그림을 끌어 위치를 맞추고, 아래 슬라이더로 늘리거나 줄인다(1~3배, 마우스 휠은 쓰지 않는다).
 * 보이는 영역은 정사각형 파일로 잘라 onChange 로 넘긴다.
 * 고른 파일은 미리 보여 주기만 하고 서버에는 보내지 않는다(올리기와 지우기는 폼의 저장 버튼이 한다).
 * 너비는 부모가 정하고, 틀은 정사각형이다.
 */
const ThumbnailUploader = ({ currentUrl, value, onChange, disabled = false }: ThumbnailUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [source, setSource] = useState<CropSource | null>(null);
  const [view, setView] = useState<CropView>(CENTER_VIEW);
  const viewRef = useRef<CropView>(CENTER_VIEW);
  const zoneRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<number | null>(null);
  const movedRef = useRef<boolean>(false);
  const cropSeqRef = useRef<number>(0);

  /* 위치를 조정할 수 있는 상태: 새로 고른 파일이 있을 때 */
  const cropping = value.type === 'upload' ? source : null;

  /* 보여 줄 그림: 새로 고른 파일 > 서버에 있는 썸네일(지우기로 했으면 없음) */
  const shownUrl =
    value.type === 'upload' ? value.previewUrl : value.type === 'none' && currentUrl ? imageUrl(currentUrl) : null;

  const applyView = (image: HTMLImageElement, next: CropView) => {
    const clamped = clampView(image, next);
    viewRef.current = clamped;
    setView(clamped);
  };

  /* 지금 보이는 영역을 잘라 새 파일로 넘긴다 (늦게 끝난 앞선 요청은 버린다) */
  const emitCrop = (target: CropSource, current: CropView) => {
    const side = visibleSide(target.image, current.zoom);
    const region = {
      x: current.cx * target.image.naturalWidth - side / 2,
      y: current.cy * target.image.naturalHeight - side / 2,
      side,
    };
    const seq = ++cropSeqRef.current;
    cropSquareFile(target.image, region, target.file)
      .then((file) => {
        if (seq === cropSeqRef.current) onChange({ type: 'upload', file, previewUrl: target.src });
      })
      .catch((error: Error) => setErrorMessage(error.message));
  };

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
    reader.onload = () => {
      const src = String(reader.result);
      const image = new Image();
      image.onload = () => {
        const next = { image, src, file };
        setSource(next);
        applyView(image, CENTER_VIEW);
        emitCrop(next, viewRef.current);
      };
      image.onerror = () => setErrorMessage('이미지를 열 수 없어요.');
      image.src = src;
    };
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

  /* 틀 안에서 끌면 보이는 영역이 움직이고, 두 손가락으로 벌리면 늘어난다 */
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!cropping || disabled || (e.target as Element).closest('button')) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
    movedRef.current = false;
    pinchRef.current = null;
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const previous = pointersRef.current.get(e.pointerId);
    if (!cropping || !previous || !zoneRef.current) return;

    movedRef.current = true;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const current = viewRef.current;

    if (pointersRef.current.size === 2) {
      const [a, b] = Array.from(pointersRef.current.values());
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchRef.current) applyView(cropping.image, { ...current, zoom: (current.zoom * distance) / pinchRef.current });
      pinchRef.current = distance;
      return;
    }

    /* 화면에서 움직인 만큼을 그림의 위치로 바꾼다 (틀 한 변 = 보이는 영역 한 변) */
    const perPixel = visibleSide(cropping.image, current.zoom) / zoneRef.current.clientWidth;
    applyView(cropping.image, {
      ...current,
      cx: current.cx - ((e.clientX - previous.x) * perPixel) / cropping.image.naturalWidth,
      cy: current.cy - ((e.clientY - previous.y) * perPixel) / cropping.image.naturalHeight,
    });
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.delete(e.pointerId)) return;
    pinchRef.current = null;
    if (cropping && movedRef.current && pointersRef.current.size === 0) emitCrop(cropping, viewRef.current);
  };

  const handleZoomChange = (zoom: number) => {
    if (cropping) applyView(cropping.image, { ...viewRef.current, zoom });
  };

  const handleZoomCommit = () => {
    if (cropping) emitCrop(cropping, viewRef.current);
  };

  const handleZoomStep = (step: number) => {
    handleZoomChange(viewRef.current.zoom + step);
    handleZoomCommit();
  };

  /* 새로 고른 파일이면 고른 것을 취소하고, 서버에 있는 썸네일이면 지우기로 표시한다 */
  const handleRemove = () => {
    setErrorMessage(null);
    setSource(null);
    onChange(value.type === 'upload' ? { type: 'none' } : { type: 'delete' });
  };

  const placeholderText = value.type === 'delete' ? '저장하면 이미지가 지워져요' : '이미지를 끌어다 놓거나 눌러서 선택';

  return (
    <Wrapper>
      <DropZone
        ref={zoneRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="썸네일 이미지 선택"
        dragging={dragging}
        cropping={!!cropping}
        onClick={() => !disabled && !cropping && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {cropping ? (
          <CropImage
            src={cropping.src}
            alt="썸네일"
            draggable={false}
            style={{
              width: `${(cropping.image.naturalWidth / visibleSide(cropping.image, view.zoom)) * 100}%`,
              height: `${(cropping.image.naturalHeight / visibleSide(cropping.image, view.zoom)) * 100}%`,
              left: `${-((view.cx * cropping.image.naturalWidth - visibleSide(cropping.image, view.zoom) / 2) / visibleSide(cropping.image, view.zoom)) * 100}%`,
              top: `${-((view.cy * cropping.image.naturalHeight - visibleSide(cropping.image, view.zoom) / 2) / visibleSide(cropping.image, view.zoom)) * 100}%`,
            }}
          />
        ) : shownUrl ? (
          <FillImage src={shownUrl} alt="썸네일" />
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
      {cropping && (
        <ZoomRow>
          <IconButton size="small" aria-label="줄이기" disabled={disabled} onClick={() => handleZoomStep(-ZOOM_STEP)}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <ZoomSlider
            size="small"
            min={1}
            max={THUMBNAIL_MAX_ZOOM}
            step={0.01}
            value={view.zoom}
            disabled={disabled}
            aria-label="확대 비율"
            onChange={(_, zoom) => handleZoomChange(Array.isArray(zoom) ? zoom[0] : zoom)}
            onChangeCommitted={handleZoomCommit}
          />
          <IconButton size="small" aria-label="늘리기" disabled={disabled} onClick={() => handleZoomStep(ZOOM_STEP)}>
            <AddIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {view.zoom.toFixed(1)}배
          </Typography>
        </ZoomRow>
      )}
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
}));

/* 끌어서 올려 놓는 동안(dragging)에는 테두리가 금색 점선으로 바뀐다. 위치를 조정하는 중(cropping)에는 끌 수 있는 손 모양이 된다 */
const DropZone = styled(Box, { shouldForwardProp: (prop) => prop !== 'dragging' && prop !== 'cropping' })<{
  dragging: boolean;
  cropping: boolean;
}>(
  ({ theme, dragging, cropping }) => ({
    position: 'relative',
    aspectRatio: '1 / 1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: cropping ? 'grab' : 'pointer',
    touchAction: cropping ? 'none' : 'auto',
    '&:active': cropping ? { cursor: 'grabbing' } : undefined,
    backgroundColor: dragging ? alpha(theme.palette.primary.main, 0.12) : theme.palette.surfaceRaised,
    border: `1px ${dragging ? 'dashed' : 'solid'} ${dragging ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: theme.shape.cardRadius,
    '&:hover': { borderColor: theme.palette.primary.main },
  }),
);

/* 위치는 style 로 정한다 (끄는 동안 값이 계속 바뀐다) */
const CropImage = styled('img')({
  position: 'absolute',
  maxWidth: 'none',
  userSelect: 'none',
  pointerEvents: 'none',
});

const ZoomRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ZoomSlider = styled(Slider)(({ theme }) => ({
  flex: 1,
  margin: theme.spacing(0, 1),
}));

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
