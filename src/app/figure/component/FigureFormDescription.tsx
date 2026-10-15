import { Controller, type UseFormReturn } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { SectionCard, SectionTitle } from '@/app/common/style/CommonCard.style';
import FigureDescriptionEditor from '@/app/figure/component/FigureDescriptionEditor';
import type { FigureFormValues } from '@/app/figure/interface/FigureFormValues';

interface FigureFormDescriptionProps {
  /** 상품 폼 */
  form: UseFormReturn<FigureFormValues>;

  /** 저장 요청 중이면 고칠 수 없다 */
  disabled: boolean;
}

/**
 * 설명 구역. 상세의 설명 구역과 같은 카드 안에서 에디터로 설명(HTML)을 쓴다.
 * 에디터는 처음 값을 한 번만 받으므로, 수정 화면은 상세를 받은 뒤에 이 구역을 그린다.
 */
const FigureFormDescription = ({ form, disabled }: FigureFormDescriptionProps) => {
  return (
    <Card>
      <SectionTitle variant="h6" component="h3">
        설명
      </SectionTitle>
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => <FigureDescriptionEditor value={field.value} onChange={field.onChange} disabled={disabled} />}
      />
    </Card>
  );
};

export default FigureFormDescription;

/* ───────── styles ───────── */

const Card = styled(SectionCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));
