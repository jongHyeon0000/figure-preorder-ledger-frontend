import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorView from '@/app/common/component/ErrorView';
import LoadingOverlay from '@/app/common/component/loading/LoadingOverlay';
import type { ThumbnailChange } from '@/app/common/interface/ThumbnailChange';
import useDeleteThumbnail from '@/app/common/service/useDeleteThumbnail';
import useUploadThumbnail from '@/app/common/service/useUploadThumbnail';
import { PageContainer, PageHeader, PageTitle } from '@/app/common/style/CommonPage.style';
import { FormBody } from '@/app/common/style/CommonForm.style';
import FigureFormActions, { FIGURE_FORM_ID } from '@/app/figure/component/FigureFormActions';
import FigureFormDescription from '@/app/figure/component/FigureFormDescription';
import FigureFormInfo from '@/app/figure/component/FigureFormInfo';
import FigureFormSchedule from '@/app/figure/component/FigureFormSchedule';
import FigureFormThumbnail from '@/app/figure/component/FigureFormThumbnail';
import type { FigureDetail } from '@/app/figure/interface/FigureDetail';
import type { FigureFormOptions } from '@/app/figure/interface/FigureFormOptions';
import type { FigureFormValues } from '@/app/figure/interface/FigureFormValues';
import useCreateFigure from '@/app/figure/service/useCreateFigure';
import useReadFigure from '@/app/figure/service/useReadFigure';
import useReadFigureFormOptions from '@/app/figure/service/useReadFigureFormOptions';
import useUpdateFigure from '@/app/figure/service/useUpdateFigure';
import { toFormValues, toSaveRequestBody } from '@/app/figure/utils/FigureUtils';
import { API_CODE } from '@/config/axios/constant/apiCode';
import { useUiStore } from '@/store/uiStore';
import { EndRow, SideColumn, SplitLayout } from '@/app/common/style/CommonLayout.style';

interface FigureFormPageProps {
  /** 등록(/figures/new)인지 수정(/figures/:figureId/edit)인지 */
  mode: 'insert' | 'edit';
}

interface FigureFormContentProps {
  mode: 'insert' | 'edit';

  /** 수정할 상품 (수정일 때만) */
  figure?: FigureDetail;

  /** 분류 선택지 */
  options: FigureFormOptions;

  /** 저장 요청 중이면 막는다 */
  saving: boolean;

  /** 입력이 통과했을 때. 고른 썸네일 변경 사항도 같이 넘긴다 (서버 요청은 페이지가 한다) */
  onSubmit: (values: FigureFormValues, thumbnail: ThumbnailChange) => void;

  /** 취소 */
  onCancel: () => void;
}

/**
 * 상품 등록, 수정 화면. 분류 선택지(수정이면 상품도)를 받아 온 뒤에 폼을 그린다(defaultValues 는 처음 한 번만 반영된다).
 * 저장하면 상품을 먼저 저장해 id 를 받고, 그 id 로 썸네일을 올리거나 지운 뒤 상세로 이동한다.
 */
const FigureFormPage = ({ mode }: FigureFormPageProps) => {
  const navigate = useNavigate();
  const figureId = Number(useParams().figureId);
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const showResult = useUiStore((state) => state.showResult);

  const { figure, figureLoading, fetchReadFigure } = useReadFigure();
  const { formOptions, formOptionsLoading, fetchReadFigureFormOptions } = useReadFigureFormOptions();
  const { createFigureLoading, fetchCreateFigure } = useCreateFigure();
  const { updateFigureLoading, fetchUpdateFigure } = useUpdateFigure();
  const { uploadThumbnailLoading, fetchUploadThumbnail } = useUploadThumbnail();
  const { deleteThumbnailLoading, fetchDeleteThumbnail } = useDeleteThumbnail();

  const fetchAll = () => {
    if (mode === 'edit') fetchReadFigure(figureId);
    fetchReadFigureFormOptions();
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, figureId]);

  const failed = [mode === 'edit' ? figure : undefined, formOptions].find(
    (res) => res !== undefined && res.code !== API_CODE.OK,
  );
  const loaded = formOptions?.code === API_CODE.OK && (mode === 'insert' || figure?.code === API_CODE.OK);
  const saving =
    createFigureLoading || updateFigureLoading || uploadThumbnailLoading || deleteThumbnailLoading;

  /* 고른 썸네일 변경 사항을 서버에 보낸다. 보낼 것이 없으면 null */
  const saveThumbnail = async (savedFigureId: number, thumbnail: ThumbnailChange) => {
    if (thumbnail.type === 'none') return null;

    return thumbnail.type === 'upload'
      ? fetchUploadThumbnail('figure', savedFigureId, thumbnail.file)
      : fetchDeleteThumbnail('figure', savedFigureId);
  };

  const handleFormCancel = () => navigate(mode === 'insert' ? '/figures' : `/figures/${figureId}`);

  const handleFigureSave = async (values: FigureFormValues, thumbnail: ThumbnailChange) => {
    const body = toSaveRequestBody(values);
    const res = mode === 'insert' ? await fetchCreateFigure(body) : await fetchUpdateFigure(figureId, body);

    if (res.code !== API_CODE.OK) {
      showResult(res);
      return;
    }

    const savedFigureId = res.data!.figureId;
    const thumbnailRes = await saveThumbnail(savedFigureId, thumbnail);

    if (thumbnailRes !== null && thumbnailRes.code !== API_CODE.OK) {
      showSnackbar(`저장했지만 이미지는 처리하지 못했어요. ${thumbnailRes.message}`, 'warning');
    } else {
      showResult(res);
    }
    navigate(`/figures/${savedFigureId}`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle variant="h4" component="h1">
          {mode === 'insert' ? '상품 등록' : '상품 수정'}
        </PageTitle>
        <FigureFormActions mode={mode} saving={saving} showSubmit={loaded} onCancel={handleFormCancel} />
      </PageHeader>

      {failed && <ErrorView message={failed.message} onRetry={fetchAll} />}
      {loaded && (
        <FigureFormContent
          mode={mode}
          figure={mode === 'edit' ? figure!.data! : undefined}
          options={formOptions.data!}
          saving={saving}
          onSubmit={handleFigureSave}
          onCancel={handleFormCancel}
        />
      )}

      <LoadingOverlay open={figureLoading || formOptionsLoading || saving} />
    </PageContainer>
  );
};

/**
 * 폼 본체. 상세 화면과 같은 틀(왼쪽 썸네일·일정·금액, 오른쪽 정보, 아래 설명)에 입력칸을 둔다.
 */
const FigureFormContent = ({ mode, figure, options, saving, onSubmit, onCancel }: FigureFormContentProps) => {
  const form = useForm<FigureFormValues>({ mode: 'onTouched', defaultValues: toFormValues(figure) });
  const [thumbnail, setThumbnail] = useState<ThumbnailChange>({ type: 'none' });

  const handleValid = (values: FigureFormValues) => onSubmit(values, thumbnail);

  return (
    <FormBody id={FIGURE_FORM_ID} noValidate onSubmit={form.handleSubmit(handleValid)}>
      <SplitLayout>
        <SideColumn>
          <FigureFormThumbnail
            currentUrl={figure?.thumbnailUrl}
            value={thumbnail}
            onChange={setThumbnail}
            disabled={saving}
          />
          <FigureFormSchedule form={form} />
        </SideColumn>
        <FigureFormInfo form={form} options={options} showStatus={mode === 'insert'} />
      </SplitLayout>
      <FigureFormDescription form={form} disabled={saving} />
      <EndRow>
        <FigureFormActions mode={mode} saving={saving} showSubmit onCancel={onCancel} />
      </EndRow>
    </FormBody>
  );
};

export default FigureFormPage;
