import { Box, Button, List, Tooltip, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CategoryChildRow from '@/app/category/component/CategoryChildRow';
import CategoryGroupItem from '@/app/category/component/CategoryGroupItem';
import { CATEGORY_AXES, PROTECTED_CATEGORY_NAME, type CategoryAxisKey, type CategoryLevel } from '@/app/category/constant/categoryAxes';
import type { CategoryGroup } from '@/app/category/interface/CategoryGroup';
import type { CategoryItem } from '@/app/category/interface/CategoryItem';
import { TonalButton, TonalDangerButton } from '@/app/common/style/CommonButton.style';
import { InfoIcon, TooltipText } from '@/app/common/style/CommonTooltip.style';

interface CategoryTreeProps {
  /** 지금 보고 있는 축 */
  axis: CategoryAxisKey;

  /** 상위 분류 목록 (하위 포함). 비어 있지 않을 때만 쓴다 */
  groups: CategoryGroup[];

  /** 오른쪽에 하위를 펼칠 상위 id. 없으면 첫 번째 상위 */
  selectedGroupId: number | null;

  /** 왼쪽 목록에서 상위를 골랐을 때 */
  onSelectGroup: (groupId: number) => void;

  /** 추가 버튼을 눌렀을 때. 하위를 추가할 때는 속할 상위 id 를 같이 넘긴다 */
  onInsert: (level: CategoryLevel, parentId?: number) => void;

  /** 수정 버튼을 눌렀을 때 */
  onEdit: (level: CategoryLevel, target: CategoryItem) => void;

  /** 삭제 버튼을 눌렀을 때 */
  onDelete: (level: CategoryLevel, target: CategoryItem) => void;
}

/**
 * 분류 목록. 왼쪽에 상위 목록, 오른쪽에 고른 상위의 하위 목록을 둔다.
 * 제조사처럼 하위가 없는 축(child 가 null)은 오른쪽 없이 상위만 한 줄씩 보여 준다.
 */
const CategoryTree = ({ axis, groups, selectedGroupId, onSelectGroup, onInsert, onEdit, onDelete }: CategoryTreeProps) => {
  const { nameKr, child: childConfig } = CATEGORY_AXES[axis];

  if (childConfig === null) {
    return (
      <Panel>
        <PanelTop>
          <PanelHeader sx={{ pr: 1 }}>
            <Typography variant="h6">{nameKr} 목록</Typography>
            <TonalButton size="small" variant="contained" disableElevation onClick={() => onInsert('group')}>
              {nameKr} 추가
            </TonalButton>
          </PanelHeader>
        </PanelTop>
        <Box>
          {groups.map((group) => (
            <CategoryChildRow key={group.id} item={group} onEdit={() => onEdit('group', group)} onDelete={() => onDelete('group', group)} />
          ))}
        </Box>
      </Panel>
    );
  }

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0];
  const isGroupProtected = selectedGroup.name === PROTECTED_CATEGORY_NAME;

  return (
    <TreeLayout>
      <Panel>
        <PanelTop>
          <PanelHeader sx={{ pr: 1 }}>
            <Typography variant="h6">그룹</Typography>
            <TonalButton size="small" variant="contained" disableElevation onClick={() => onInsert('group')}>
              추가
            </TonalButton>
          </PanelHeader>
        </PanelTop>
        <List disablePadding>
          {groups.map((group) => (
            <CategoryGroupItem
              key={group.id}
              group={group}
              selected={group.id === selectedGroup.id}
              onSelect={() => onSelectGroup(group.id)}
            />
          ))}
        </List>
      </Panel>

      <Panel>
        <PanelTop>
          <PanelHeader sx={{ pr: 1 }}>
            <Typography variant="h6">
              {selectedGroup.name}
              {selectedGroup.description !== '' && (
                <Tooltip title={<TooltipText>{selectedGroup.description}</TooltipText>} placement="right-start">
                  <InfoIcon fontSize="inherit" />
                </Tooltip>
              )}
            </Typography>
            {!isGroupProtected && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TonalButton size="small" onClick={() => onEdit('group', selectedGroup)}>
                  그룹 수정
                </TonalButton>
                <TonalDangerButton size="small" onClick={() => onDelete('group', selectedGroup)}>
                  그룹 삭제
                </TonalDangerButton>
              </Box>
            )}
          </PanelHeader>
        </PanelTop>
        <Box>
          {selectedGroup.children.map((child) => (
            <CategoryChildRow key={child.id} item={child} onEdit={() => onEdit('child', child)} onDelete={() => onDelete('child', child)} />
          ))}
        </Box>
        {!isGroupProtected && (
          <AddRow>
            <AddButton variant="outlined" size="small" startIcon={<AddOutlinedIcon />} onClick={() => onInsert('child', selectedGroup.id)}>
              하위 추가
            </AddButton>
          </AddRow>
        )}
      </Panel>
    </TreeLayout>
  );
};

export default CategoryTree;

/* ───────── styles ───────── */

const TreeLayout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '240px 1fr',
  gap: theme.spacing(2),
  alignItems: 'start',
}));

const Panel = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  overflow: 'hidden',
}));

const PanelHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 2),
}));

/* 패널 맨 위 칸(제목과 설명). 목록보다 어두운 면에 가는 금색 밑줄로 목록과 나눈다 */
const PanelTop = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.surfaceSunken,
  borderBottom: `1px solid ${theme.palette.primary.main}`,
}));

const AddRow = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

/* 하위를 더 넣는 자리처럼 보이는 점선 칸 */
const AddButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5, 0),
  borderStyle: 'dashed',
  borderColor: alpha(theme.palette.primary.main, 0.5),
  '&:hover': { borderStyle: 'dashed' },
}));
