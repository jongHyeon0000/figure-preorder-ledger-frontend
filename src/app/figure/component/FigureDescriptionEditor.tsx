import { useEffect, useRef, type ChangeEvent, type ClipboardEvent, type DragEvent, type ReactNode } from 'react';
import { Box, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import RedoIcon from '@mui/icons-material/Redo';
import TitleIcon from '@mui/icons-material/Title';
import UndoIcon from '@mui/icons-material/Undo';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { THUMBNAIL_ACCEPT } from '@/app/common/constant/thumbnailFile';
import { imageUrl } from '@/app/common/utils/CommonUtils';
import { validateThumbnailFiles } from '@/app/common/utils/ValidationUtils';
import useUploadEditorImage from '@/app/figure/service/useUploadEditorImage';
import { API_CODE } from '@/config/axios/constant/apiCode';
import { useUiStore } from '@/store/uiStore';
import { alpha, styled } from '@mui/material/styles';

/*
* 이미지 노드. 저장되는 주소(src)는 서버가 준 '/uploads/...' 상대 경로 그대로 두고, 에디터 화면에 그릴 때만 서버 주소를 붙인다.
* (상대 경로로 저장해야 서버가 상품에 이미지를 연결한다. 운영에서 다른 도메인을 써도 저장 값은 바뀌지 않는다)
* */
const EditorImage = Image.extend({
  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('img');
      dom.src = imageUrl(node.attrs.src);

      return {
        dom,
        update: (updated) => {
          if (updated.type !== node.type) return false;
          dom.src = imageUrl(updated.attrs.src);
          return true;
        },
      };
    };
  },
});

interface FigureDescriptionEditorProps {
  /** 처음 채울 설명 HTML (에디터는 이 값을 처음 한 번만 받는다) */
  value: string;

  /** 내용이 바뀔 때마다 HTML (비어 있으면 빈 글자) */
  onChange: (html: string) => void;

  /** 저장 요청 중이면 고칠 수 없다 */
  disabled: boolean;
}

/**
 * 상품 설명 에디터(Tiptap). 위에 도구줄이 붙어 있고, 이미지는 버튼, 끌어다 놓기, 붙여넣기로 넣는다.
 * 이미지는 서버에 올려서 받은 주소로 들어가며 한 장씩 차례로 올린다.
 */
const FigureDescriptionEditor = ({ value, onChange, disabled }: FigureDescriptionEditorProps) => {
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const showResult = useUiStore((state) => state.showResult);
  const { uploadEditorImageLoading, fetchUploadEditorImage } = useUploadEditorImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      EditorImage,
      Placeholder.configure({ placeholder: '상품 설명을 입력해 주세요' }),
    ],
    content: value,
    onUpdate: ({ editor: updated }) => onChange(updated.isEmpty ? '' : updated.getHTML()),
  });

  /* 도구 버튼의 켜짐 상태 (글자 위치가 바뀔 때마다 다시 계산한다) */
  const active = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current?.isActive('bold') ?? false,
      italic: current?.isActive('italic') ?? false,
      strike: current?.isActive('strike') ?? false,
      heading: current?.isActive('heading', { level: 2 }) ?? false,
      bulletList: current?.isActive('bulletList') ?? false,
      orderedList: current?.isActive('orderedList') ?? false,
      blockquote: current?.isActive('blockquote') ?? false,
    }),
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor || !active) return null;

  /* 고른 이미지들을 한 장씩 올려서 본문에 넣는다. position 이 있으면 그 자리에 넣는다(끌어다 놓기) */
  const insertImages = async (files: File[], position?: number) => {
    if (position !== undefined) editor.commands.setTextSelection(position);

    for (const file of files) {
      const message = validateThumbnailFiles([file]);
      if (message) {
        showSnackbar(`${file.name}: ${message}`, 'warning');
        continue;
      }

      const res = await fetchUploadEditorImage(file);
      if (res.code !== API_CODE.OK) {
        showResult(res);
        continue;
      }
      /* 이미지만 넣으면 그 이미지가 선택된 채로 남아서 다음 이미지가 덮어쓰므로, 뒤에 빈 문단을 같이 넣어 커서를 그리로 옮긴다 */
      editor
        .chain()
        .focus()
        .insertContent([{ type: 'image', attrs: { src: res.data!.url } }, { type: 'paragraph' }])
        .run();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    insertImages(Array.from(e.target.files ?? []));
    /* 같은 파일을 다시 골라도 change 가 일어나도록 비운다 */
    e.target.value = '';
  };

  /* 파일이 끼어 있는 끌어다 놓기와 붙여넣기만 가로채고, 글자는 에디터가 그대로 처리한다 */
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    e.preventDefault();
    e.stopPropagation();
    const dropPosition = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
    insertImages(files, dropPosition?.pos);
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(e.clipboardData.files);
    if (files.length === 0) return;

    e.preventDefault();
    e.stopPropagation();
    insertImages(files);
  };

  return (
    <Box>
      <Toolbar>
        <ToolButton label="굵게" active={active.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FormatBoldIcon />
        </ToolButton>
        <ToolButton label="기울임" active={active.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FormatItalicIcon />
        </ToolButton>
        <ToolButton label="취소선" active={active.strike} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <FormatStrikethroughIcon />
        </ToolButton>
        <Divider orientation="vertical" flexItem />
        <ToolButton
          label="제목"
          active={active.heading}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <TitleIcon />
        </ToolButton>
        <ToolButton
          label="글머리 목록"
          active={active.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedIcon />
        </ToolButton>
        <ToolButton
          label="번호 목록"
          active={active.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumberedIcon />
        </ToolButton>
        <ToolButton label="인용" active={active.blockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <FormatQuoteIcon />
        </ToolButton>
        <ToolButton label="구분선" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <HorizontalRuleIcon />
        </ToolButton>
        <Divider orientation="vertical" flexItem />
        <ToolButton label="되돌리기" onClick={() => editor.chain().focus().undo().run()}>
          <UndoIcon />
        </ToolButton>
        <ToolButton label="다시 하기" onClick={() => editor.chain().focus().redo().run()}>
          <RedoIcon />
        </ToolButton>
        <Divider orientation="vertical" flexItem />
        <ToolButton label="이미지 넣기" disabled={uploadEditorImageLoading} onClick={() => fileInputRef.current?.click()}>
          <ImageOutlinedIcon />
        </ToolButton>
        {uploadEditorImageLoading && (
          <Typography variant="caption" color="primary">
            이미지 올리는 중…
          </Typography>
        )}
        <input ref={fileInputRef} type="file" accept={THUMBNAIL_ACCEPT} multiple hidden onChange={handleFileChange} />
      </Toolbar>

      <Content onDropCapture={handleDrop} onPasteCapture={handlePaste}>
        <EditorContent editor={editor} />
      </Content>
    </Box>
  );
};

export default FigureDescriptionEditor;

interface ToolButtonProps {
  /** 마우스를 올렸을 때 보이는 이름 */
  label: string;

  /** 지금 적용 중인 모양이면 true */
  active?: boolean;

  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

/* 도구줄 버튼 하나. 켜져 있으면 포인트 색 면을 깐다 */
const ToolButton = ({ label, active = false, disabled = false, onClick, children }: ToolButtonProps) => {
  return (
    <Tooltip title={label}>
      <span>
        <ToolIconButton size="small" active={active} disabled={disabled} aria-label={label} onClick={onClick}>
          {children}
        </ToolIconButton>
      </span>
    </Tooltip>
  );
};

/* ───────── styles ───────── */

const Toolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.75, 1.25),
  backgroundColor: theme.palette.surfaceRaised,
  border: `1px solid ${theme.palette.lineSubtle}`,
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
}));

const ToolIconButton = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'active' })<{ active: boolean }>(
  ({ theme, active }) => ({
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    backgroundColor: active ? alpha(theme.palette.primary.main, 0.26) : 'transparent',
  }),
);

/* 글을 쓰는 어두운 면. 안의 ProseMirror 영역이 이 면을 가득 채워서 어디를 눌러도 글을 쓸 수 있다 */
const Content = styled(Box)(({ theme }) => ({
  minHeight: theme.spacing(24),
  backgroundColor: theme.palette.surfaceSunken,
  border: `1px solid ${theme.palette.lineSubtle}`,
  borderTop: 0,
  borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
  '& .tiptap': {
    minHeight: theme.spacing(24),
    padding: theme.spacing(3),
    outline: 'none',
    wordBreak: 'break-word',
  },
  '& .tiptap img': { display: 'block', maxWidth: '100%', height: 'auto' },
  '& .tiptap p.is-editor-empty:first-of-type::before': {
    content: 'attr(data-placeholder)',
    float: 'left',
    height: 0,
    color: theme.palette.text.secondary,
    pointerEvents: 'none',
  },
}));
