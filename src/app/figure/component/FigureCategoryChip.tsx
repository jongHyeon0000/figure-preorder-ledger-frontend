import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { imageUrl } from '@/app/common/utils/CommonUtils';
import { IconButton } from '@mui/material';
import { Pill } from '@/app/common/style/CommonCard.style';
import { ThumbAvatar } from '@/app/common/style/CommonMedia.style';
import { styled } from '@mui/material/styles';

interface FigureCategoryChipProps {
  /** 분류 이름 */
  name: string;

  /** 상위 이름. 있으면 "상위 › 이름"으로 보여 준다 */
  groupName?: string;

  /** 분류 썸네일 주소. 없으면 이미지 아이콘 */
  thumbnailUrl?: string;

  /** 있으면 오른쪽에 지우기 버튼을 보여 준다 (폼에서 고른 값을 뺄 때) */
  onDelete?: () => void;
}

/**
 * 분류 한 건을 동그란 썸네일과 이름으로 보여 주는 알약 (표시 전용)
 */
const FigureCategoryChip = ({ name, groupName, thumbnailUrl, onDelete }: FigureCategoryChipProps) => {
  return (
    <Chip>
      <ThumbAvatar size="sm" src={imageUrl(thumbnailUrl)}>
        <ImageOutlinedIcon fontSize="small" />
      </ThumbAvatar>
      {groupName && <GroupName>{groupName} ›</GroupName>}
      {name}
      {onDelete && (
        <ChipDelete size="small" aria-label={`${name} 지우기`} onClick={onDelete}>
          <CloseIcon fontSize="inherit" />
        </ChipDelete>
      )}
    </Chip>
  );
};

export default FigureCategoryChip;

/* ───────── styles ───────── */

const Chip = styled(Pill)(({ theme }) => ({
  gap: theme.spacing(1.25),
  padding: theme.spacing(0.625, 2, 0.625, 0.625),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const GroupName = styled('span')(({ theme }) => ({
  marginRight: theme.spacing(-0.5),
  color: theme.palette.text.secondary,
}));

const ChipDelete = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(-1.5),
  marginLeft: theme.spacing(-0.5),
  color: theme.palette.text.secondary,
}));
