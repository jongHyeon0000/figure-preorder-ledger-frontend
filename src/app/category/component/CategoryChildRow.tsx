import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { PROTECTED_CATEGORY_NAME } from '@/app/category/constant/categoryAxes';
import type { CategoryItem } from '@/app/category/interface/CategoryItem';
import { InfoIcon, TooltipText } from '@/app/common/style/CommonTooltip.style';

interface CategoryChildRowProps {
  /** 보여 줄 분류 (하위, 또는 하위가 없는 축의 상위) */
  item: CategoryItem;

  /** 수정 버튼을 눌렀을 때 */
  onEdit: () => void;

  /** 삭제 버튼을 눌렀을 때 */
  onDelete: () => void;
}

/**
 * 분류 한 줄. 이름, 설명, 수정/삭제 버튼을 보여 준다. 서버가 막아 둔 '기타'는 버튼 대신 기본 항목 표시를 둔다.
 */
const CategoryChildRow = ({ item, onEdit, onDelete }: CategoryChildRowProps) => {
  const isProtected = item.name === PROTECTED_CATEGORY_NAME;

  return (
    <RowBox>
      <TextBox>
        <Typography sx={{ fontWeight: 700 }}>
          {item.name}
          {item.description && (
            <Tooltip title={<TooltipText>{item.description}</TooltipText>} placement="right-start">
              <InfoIcon fontSize="inherit" />
            </Tooltip>
          )}
        </Typography>
        {item.description && (
          <Description variant="caption" color="text.secondary">
            {item.description}
          </Description>
        )}
      </TextBox>
      {isProtected ? (
        <Chip label="기본 항목" size="small" variant="outlined" />
      ) : (
        <ButtonGroup>
          <Tooltip title="수정">
            <IconButton size="small" aria-label="수정" onClick={onEdit}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="삭제">
            <IconButton size="small" color="error" aria-label="삭제" onClick={onDelete}>
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      )}
    </RowBox>
  );
};

export default CategoryChildRow;

/* ───────── styles ───────── */

const RowBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  /* 줄무늬: 같은 부모 안에서 홀수/짝수 줄 색을 번갈아 쓴다 (부모는 이 줄들만 담는 상자여야 한다) */
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.rowStripe },
  '&:nth-of-type(even)': { backgroundColor: theme.palette.rowStripeAlt },
  '&:hover': { backgroundColor: theme.palette.rowHover },
}));

/* 설명은 한 줄로 보여 주고, 길면 …로 줄인다 (전체 글은 이름 옆 아이콘에 올리면 툴팁으로 본다) */
const TextBox = styled(Box)({
  flex: 1,
  minWidth: 0,
});

const Description = styled(Typography)(({ theme }) => ({
  display: 'block',
  marginTop: theme.spacing(1),
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})) as typeof Typography;

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  gap: theme.spacing(0.5),
}));
