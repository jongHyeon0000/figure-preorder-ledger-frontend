import { useState } from 'react';
import { Box, Button, FormHelperText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FigureCategoryChip from '@/app/figure/component/FigureCategoryChip';
import FigurePickDialog from '@/app/figure/component/FigurePickDialog';
import { InfoChips, InfoRow } from '@/app/figure/style/FigureInfo.style';
import type { FigurePickItem } from '@/app/figure/interface/FigurePickItem';
import { LabelText } from '@/app/common/style/CommonText.style';

interface FigurePickFieldProps {
  /** 줄 이름 (예: "캐릭터") */
  label: string;

  /** 선택 창 제목 */
  dialogTitle: string;

  /** 지금 고른 것 (칩으로 보여 준다) */
  chips: FigurePickItem[];

  /** 선택 창에서 고를 수 있는 항목 */
  pool: FigurePickItem[];

  /** 여러 개를 고르는 칸인지 */
  multiple: boolean;

  /** 칩에 "상위 › 이름"으로 상위를 붙일지 */
  showGroup?: boolean;

  /** 추가 버튼을 막는다 (캐릭터는 장르를 먼저 골라야 한다) */
  disabled?: boolean;

  /** 검증 오류 문구 */
  errorMessage?: string;

  /** 고른 id 목록이 바뀌었을 때 */
  onChange: (ids: number[]) => void;
}

/**
 * 분류 한 줄. 고른 것은 칩으로 보여 주고(× 로 빼기), "추가" 버튼은 선택 창을 연다.
 * 한 개짜리 칸은 추가하면 기존 값이 바뀐다.
 */
const FigurePickField = ({
  label,
  dialogTitle,
  chips,
  pool,
  multiple,
  showGroup = false,
  disabled = false,
  errorMessage,
  onChange,
}: FigurePickFieldProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const chipIds = chips.map((chip) => chip.id);

  return (
    <InfoRow>
      <LabelText>{label}</LabelText>
      <Box>
        <InfoChips>
          {chips.map((chip) => (
            <FigureCategoryChip
              key={chip.id}
              name={chip.name}
              groupName={showGroup ? chip.groupName : undefined}
              thumbnailUrl={chip.thumbnailUrl}
              onDelete={() => onChange(chipIds.filter((id) => id !== chip.id))}
            />
          ))}
          <Button variant="outlined" color="inherit" size="small" startIcon={<AddIcon />} disabled={disabled} onClick={() => setOpen(true)}>
            추가
          </Button>
        </InfoChips>
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      </Box>

      {open && (
        <FigurePickDialog
          title={dialogTitle}
          items={pool}
          selectedIds={chipIds}
          multiple={multiple}
          onSelect={(ids) => {
            onChange(ids);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </InfoRow>
  );
};

export default FigurePickField;
