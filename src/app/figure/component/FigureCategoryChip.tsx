import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { imageUrl } from '@/app/common/utils/CommonUtils';

interface FigureCategoryChipProps {
  /** 분류 이름 */
  name: string;

  /** 상위 이름. 있으면 "상위 › 이름"으로 보여 준다 */
  groupName?: string;

  /** 분류 썸네일 주소. 없으면 이미지 아이콘 */
  thumbnailUrl?: string;
}

/**
 * 분류 한 건을 동그란 썸네일과 이름으로 보여 주는 알약 (표시 전용)
 */
const FigureCategoryChip = ({ name, groupName, thumbnailUrl }: FigureCategoryChipProps) => {
  return (
    <Chip>
      <ChipImage src={imageUrl(thumbnailUrl)}>
        <ImageOutlinedIcon fontSize="small" />
      </ChipImage>
      {groupName && <GroupName>{groupName} ›</GroupName>}
      {name}
    </Chip>
  );
};

export default FigureCategoryChip;

/* ───────── styles ───────── */

const Chip = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  padding: theme.spacing(0.625, 2, 0.625, 0.625),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 999,
}));

const ChipImage = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.menuSurfaceSub,
}));

const GroupName = styled('span')(({ theme }) => ({
  marginRight: theme.spacing(-0.5),
  color: theme.palette.text.secondary,
}));
