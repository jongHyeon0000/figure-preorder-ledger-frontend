import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorView from '@/app/common/component/ErrorView';
import LoadingOverlay from '@/app/common/component/loading/LoadingOverlay';
import { TonalButton, TonalDangerButton } from '@/app/common/style/CommonButton.style';
import { PageContainer, PageHeader, PageTitle } from '@/app/common/style/CommonPage.style';
import { showConfirmAlert } from '@/app/common/utils/AlertUtils';
import FigureDetailDescription from '@/app/figure/component/FigureDetailDescription';
import FigureDetailInfo from '@/app/figure/component/FigureDetailInfo';
import FigureDetailSchedule from '@/app/figure/component/FigureDetailSchedule';
import FigureDetailThumbnail from '@/app/figure/component/FigureDetailThumbnail';
import useDeleteFigure from '@/app/figure/service/useDeleteFigure';
import useReadFigure from '@/app/figure/service/useReadFigure';
import useReadFigureFormOptions from '@/app/figure/service/useReadFigureFormOptions';
import { API_CODE } from '@/config/axios/constant/apiCode';
import { useUiStore } from '@/store/uiStore';

/**
 * 상품 상세 화면 (/figures/:figureId)
 * 상품과 분류 선택지(분류 썸네일용)를 같이 받아 와서, 둘 다 성공해야 그린다.
 */
const FigureDetailPage = () => {
  const navigate = useNavigate();
  const figureId = Number(useParams().figureId);
  const showResult = useUiStore((state) => state.showResult);

  const { figure, figureLoading, fetchReadFigure } = useReadFigure();
  const { formOptions, formOptionsLoading, fetchReadFigureFormOptions } = useReadFigureFormOptions();
  const { deleteFigureLoading, fetchDeleteFigure } = useDeleteFigure();

  const fetchAll = () => {
    fetchReadFigure(figureId);
    fetchReadFigureFormOptions();
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [figureId]);

  const failed = [figure, formOptions].find((res) => res !== undefined && res.code !== API_CODE.OK);
  const loaded = figure?.code === API_CODE.OK && formOptions?.code === API_CODE.OK;

  const handleFigureDelete = async (name: string) => {
    const confirmed = await showConfirmAlert({
      title: `'${name}'을(를) 삭제할까요?`,
      text: '삭제하면 되돌릴 수 없어요.',
      confirmText: '삭제',
      danger: true,
      focusCancel: true,
    });
    if (!confirmed) return;

    const res = await fetchDeleteFigure(figureId);
    showResult(res);
    if (res.code === API_CODE.OK) navigate('/figures');
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle variant="h4" component="h1">
          상품 상세
        </PageTitle>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={() => navigate('/figures')}>
            목록
          </Button>
          {loaded && (
            <>
              <TonalButton onClick={() => navigate(`/figures/${figureId}/edit`)}>수정</TonalButton>
              <TonalDangerButton onClick={() => handleFigureDelete(figure.data!.name)}>삭제</TonalDangerButton>
            </>
          )}
        </Box>
      </PageHeader>

      {failed && <ErrorView message={failed.message} onRetry={fetchAll} />}
      {loaded && (
        <>
          <Layout>
            <LeftColumn>
              <FigureDetailThumbnail figure={figure.data!} />
              <FigureDetailSchedule figure={figure.data!} />
            </LeftColumn>
            <FigureDetailInfo figure={figure.data!} options={formOptions.data!} />
          </Layout>
          <FigureDetailDescription figure={figure.data!} />
        </>
      )}

      <LoadingOverlay open={figureLoading || formOptionsLoading || deleteFigureLoading} />
    </PageContainer>
  );
};

export default FigureDetailPage;

/* ───────── styles ───────── */

/* 왼쪽(썸네일, 일정·금액) 1 : 오른쪽(정보) 2 */
const Layout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1fr 2fr',
  },
}));

const LeftColumn = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  gap: theme.spacing(2),
}));
