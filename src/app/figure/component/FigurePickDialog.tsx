import { useState, type ChangeEvent } from 'react';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { TonalButton } from '@/app/common/style/CommonButton.style';
import { imageUrl } from '@/app/common/utils/CommonUtils';
import { PICK_PAGE_SIZE } from '@/app/figure/constant/figurePick';
import type { FigurePickItem } from '@/app/figure/interface/FigurePickItem';
import { collectPickGroups, getPickPage, searchPickItems } from '@/app/figure/utils/FigureUtils';

interface FigurePickDialogProps {
  /** 창 제목 (예: "캐릭터 추가") */
  title: string;

  /** 고를 수 있는 항목 전체 */
  items: FigurePickItem[];

  /** 이미 고른 id */
  selectedIds: number[];

  /** true 면 여러 개를 체크해서 확인으로 넘기고, false 면 카드를 누르는 즉시 고르고 닫는다 */
  multiple: boolean;

  /** 고른 id 목록 */
  onSelect: (ids: number[]) => void;

  /** 닫기 */
  onClose: () => void;
}

/**
 * 분류 선택 창. 이름 검색, 상위 탭(상위가 둘 이상일 때), 한 줄 5개 카드, 쪽 번호.
 * 목록은 폼이 이미 받아 둔 것이라 검색과 쪽 나누기는 모두 화면에서 한다. 열릴 때마다 새로 그려진다.
 */
const FigurePickDialog = ({ title, items, selectedIds, multiple, onSelect, onClose }: FigurePickDialogProps) => {
  const [keyword, setKeyword] = useState<string>('');
  const [groupId, setGroupId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [checkedIds, setCheckedIds] = useState<number[]>(selectedIds);

  const groups = collectPickGroups(items);
  const matched = searchPickItems(items, keyword, groupId);
  const pageItems = getPickPage(matched, page, PICK_PAGE_SIZE);

  const handleKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  const handleGroup = (nextGroupId: number | null) => {
    setGroupId(nextGroupId);
    setPage(1);
  };

  const handleCard = (id: number) => {
    if (!multiple) {
      onSelect([id]);
      return;
    }
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((checkedId) => checkedId !== id) : [...prev, id]));
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Body>
          <TextField placeholder="이름으로 검색" autoFocus value={keyword} onChange={handleKeyword} />

          {groups.length > 1 && (
            <Tabs>
              <Chip label="전체" color={groupId === null ? 'primary' : 'default'} onClick={() => handleGroup(null)} />
              {groups.map((group) => (
                <Chip
                  key={group.id}
                  label={group.name}
                  color={groupId === group.id ? 'primary' : 'default'}
                  onClick={() => handleGroup(group.id)}
                />
              ))}
            </Tabs>
          )}

          {pageItems.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
              검색 결과가 없어요
            </Typography>
          ) : (
            <Cards>
              {pageItems.map((item) => {
                const checked = checkedIds.includes(item.id);
                return (
                  <Card key={item.id} selected={checked} onClick={() => handleCard(item.id)}>
                    {checked && <CheckMark fontSize="small" />}
                    <CardImage src={imageUrl(item.thumbnailUrl)}>
                      <ImageOutlinedIcon />
                    </CardImage>
                    <span>{item.name}</span>
                  </Card>
                );
              })}
            </Cards>
          )}

          {matched.length > PICK_PAGE_SIZE && (
            <Pager>
              <Pagination
                count={Math.ceil(matched.length / PICK_PAGE_SIZE)}
                page={page}
                onChange={(_, nextPage) => setPage(nextPage)}
              />
            </Pager>
          )}
        </Body>
      </DialogContent>
      <FormActions>
        {multiple && <Typography color="text.secondary">{checkedIds.length}개 선택됨</Typography>}
        <TonalButton onClick={onClose}>닫기</TonalButton>
        {multiple && (
          <Button variant="contained" onClick={() => onSelect(checkedIds)}>
            확인
          </Button>
        )}
      </FormActions>
    </Dialog>
  );
};

export default FigurePickDialog;

/* ───────── styles ───────── */

const Body = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1),
}));

const Tabs = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

const Cards = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: theme.spacing(1.25),
}));

const Card = styled(ButtonBase, { shouldForwardProp: (prop) => prop !== 'selected' })<{ selected: boolean }>(
  ({ theme, selected }) => ({
    position: 'relative',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(1.75, 0.75, 1.25),
    textAlign: 'center',
    backgroundColor: selected ? alpha(theme.palette.primary.main, 0.14) : theme.palette.surfaceRaised,
    border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.lineSubtle}`,
    borderRadius: 12,
  }),
);

const CardImage = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.menuSurfaceSub,
}));

const CheckMark = styled(CheckIcon)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(0.75),
  right: theme.spacing(0.75),
  color: theme.palette.primary.main,
}));

const Pager = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
});

/* 버튼 줄. 기본 여백(8px)이 좁아서 오른쪽과 아래를 16px 로 넓힌다 */
const FormActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(1, 2, 2),
}));
