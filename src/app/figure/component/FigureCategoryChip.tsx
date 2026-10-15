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
      <Photo size="md" src={imageUrl(thumbnailUrl)}>
        <ImageOutlinedIcon fontSize="small" />
      </Photo>
      <Label>
        {groupName && <GroupName>{groupName} ›</GroupName>}
        {name}
        {onDelete && (
          <ChipDelete size="small" aria-label={`${name} 지우기`} onClick={onDelete}>
            <CloseIcon fontSize="inherit" />
          </ChipDelete>
        )}
      </Label>
    </Chip>
  );
};

export default FigureCategoryChip;

/* ───────── styles ───────── */

/* 동그란 사진(48px)과 그 옆의 낮은 이름 알약이 열쇠처럼 이어진다. 줄 높이는 사진을 따르고 사진이 알약보다 위아래로 튀어나온다 */
const Chip = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
});

/* 알약 왼쪽 끝이 사진 아래로 조금 파고들고, 사진이 그 위에 그려진다 */
const Photo = styled(ThumbAvatar)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  border: `1px solid ${theme.palette.divider}`,
}));

const Label = styled(Pill)(({ theme }) => ({
  gap: theme.spacing(1.25),
  marginLeft: theme.spacing(-0.75),
  padding: theme.spacing(0.75, 2, 0.75, 2.25),
  fontSize: '0.8125rem',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderLeft: 0,
  borderRadius: `0 ${theme.shape.pillRadius}px ${theme.shape.pillRadius}px 0`,
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
