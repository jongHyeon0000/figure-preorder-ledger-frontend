import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { PROTECTED_CATEGORY_NAME } from '@/app/category/constant/categoryAxes';
import type { CategoryItem } from '@/app/category/interface/CategoryItem';

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
      <Box>
        <Typography>{item.name}</Typography>
        {item.description !== '' && (
          <Description variant="caption" color="text.secondary">
            {item.description}
          </Description>
        )}
      </Box>
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
  backgroundColor: theme.palette.surfaceRaised,
  borderBottom: `1px solid ${theme.palette.lineSubtle}`,
}));

const Description = styled(Typography)(({ theme }) => ({
  display: 'block',
  marginTop: theme.spacing(1),
  whiteSpace: 'pre-line',
})) as typeof Typography;

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  gap: theme.spacing(0.5),
}));
