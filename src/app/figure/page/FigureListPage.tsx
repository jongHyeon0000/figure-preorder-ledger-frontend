import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { showConfirmAlert } from '@/app/common/utils/AlertUtils';
import { todayString } from '@/app/common/utils/CommonUtils';
import EmptyView from '@/app/common/component/EmptyView';
import ErrorView from '@/app/common/component/ErrorView';
import LoadingOverlay from '@/app/common/component/loading/LoadingOverlay';
import { PageContainer, PageHeader, PageTitle } from '@/app/common/style/CommonPage.style';
import FigureFilterBar from '@/app/figure/component/FigureFilterBar';
import FigureFilterChips from '@/app/figure/component/FigureFilterChips';
import FigureListComponent from '@/app/figure/component/FigureListComponent';
import FigureResultSummary from '@/app/figure/component/FigureResultSummary';
import FigureListActions from '@/app/figure/component/FigureListActions';
import FigureStatusModal from '@/app/figure/component/FigureStatusModal';
import FigureStatusTabs from '@/app/figure/component/FigureStatusTabs';
import FigureUrgentModal from '@/app/figure/component/FigureUrgentModal';
import { DEADLINE_ALERT_MONTHS, type FigureTabKey } from '@/app/figure/constant/figureStatus';
import type { FigureTransition } from '@/app/figure/constant/figureTransition';
import type { FigureStatusFormValues } from '@/app/figure/interface/FigureStatusFormValues';
import useFigureSelection from '@/app/figure/hook/useFigureSelection';
import useDeleteFigureList from '@/app/figure/service/useDeleteFigureList';
import useReadFigureList from '@/app/figure/service/useReadFigureList';
import useUpdateFigureStatusList from '@/app/figure/service/useUpdateFigureStatusList';
import {
  applyFilters,
  buildFilterOptions,
  countByTab,
  filterByTab,
  isDeadlineUnder,
  pruneFilters,
  sortFigures,
  sumPaidAmount,
  sumTotalPrice,
} from '@/app/figure/utils/FigureUtils';
import {
  findBulkTransition,
  getBulkConfirm,
  getTransitionLabel,
  toStatusFormValues,
  toStatusRequestBody,
} from '@/app/figure/utils/FigureTransitionUtils';
import { API_CODE } from '@/config/axios/constant/apiCode';
import { useFigureViewStore } from '@/store/figureViewStore';
import { useUiStore } from '@/store/uiStore';

/**
 * 상품 목록 화면 (/figures)
 * 서버에서 전체를 한 번 받아 오고, 탭, 필터, 정렬은 화면에서 한다. 조건은 figureViewStore 에 담겨 상세에 갔다 와도 유지된다.
 */
const FigureListPage = () => {
  const navigate = useNavigate();
  const { figureList, figureListLoading, fetchReadFigureList } = useReadFigureList();
  const { deleteFigureListLoading, fetchDeleteFigureList } = useDeleteFigureList();
  const { updateFigureStatusListLoading, fetchUpdateFigureStatusList } = useUpdateFigureStatusList();
  const showResult = useUiStore((state) => state.showResult);
  const urgentDismissed = useUiStore((state) => state.urgentDismissed);
  const dismissUrgent = useUiStore((state) => state.dismissUrgent);
  const [urgentOpen, setUrgentOpen] = useState<boolean>(false);
  const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
  const { tab, filters, month, sort, setTab, setFilter, setMonth, setSort, resetFilters } = useFigureViewStore();

  useEffect(() => {
    fetchReadFigureList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const figures = figureList?.data ?? [];
  const tabFigures = filterByTab(figures, tab);
  const options = buildFilterOptions(tabFigures);
  /* 탭을 바꿔 선택지에 없어진 필터 값은 적용에서 뺀다 */
  const active = pruneFilters(filters, month, options);
  const shownFigures = sortFigures(applyFilters(tabFigures, active.filters, active.month), sort);

  const selection = useFigureSelection(shownFigures);

  /* 이 탭의 상품을 한 번에 바꿀 수 있는 전이. 없으면 상태 변경 버튼을 숨긴다(전체, 배송완료 탭) */
  const bulkTransition = findBulkTransition(tab);

  /* 이 값이 바뀌면 목록을 새로 그려 카드 진입 애니메이션이 다시 재생된다(탭, 선택 모드, 필터, 배송월, 정렬) */
  const listKey = JSON.stringify([tab, selection.mode, active.filters, active.month, sort]);

  /* 마감이 곧인 미구매 상품. 어느 탭에서든 전체 목록에서 찾는다 */
  const urgentFigures = figures.filter((figure) => isDeadlineUnder(figure, todayString(), DEADLINE_ALERT_MONTHS));

  /* 미구매 탭을 눌렀을 때만 임박 알림을 띄운다(처음 접속이나 새로고침에서는 띄우지 않는다) */
  const handleTabChange = (next: FigureTabKey) => {
    selection.exitMode();
    setTab(next);
    if (next === 'UNPURCHASED' && !urgentDismissed && urgentFigures.length > 0) setUrgentOpen(true);
  };

  const handleUrgentClose = (dismiss: boolean) => {
    if (dismiss) dismissUrgent();
    setUrgentOpen(false);
  };

  const handleOpenDetail = (figureId: number) => navigate(`/figures/${figureId}`);

  const handleCheckedDelete = async () => {
    const confirmed = await showConfirmAlert({
      title: `${selection.checkedIds.length}개를 삭제할까요?`,
      text: '삭제하면 되돌릴 수 없어요.',
      confirmText: '삭제',
      danger: true,
      focusCancel: true,
    });
    if (!confirmed) return;

    const res = await fetchDeleteFigureList(selection.checkedIds);
    showResult(res);
    if (res.code !== API_CODE.OK) return;

    selection.exitMode();
    fetchReadFigureList();
  };

  /* 일괄 상태 변경. 날짜 입력이 있는 전이는 창에서 날짜를 받고, 없는 전이는 바로 확인창으로 간다 */
  const handleCheckedStatusChange = () => {
    if (bulkTransition!.dateField === null) {
      handleStatusSave(bulkTransition!, null);
      return;
    }
    setStatusModalOpen(true);
  };

  const handleStatusModalSubmit = (transition: FigureTransition, values: FigureStatusFormValues) => {
    handleStatusSave(transition, values.date);
  };

  const handleStatusSave = async (transition: FigureTransition, date: Dayjs | null) => {
    const confirmed = await showConfirmAlert(getBulkConfirm(transition, selection.checkedIds.length, date));
    if (!confirmed) return;

    const body = toStatusRequestBody(transition, { ...toStatusFormValues([transition], 0), date }, selection.checkedIds);
    const res = await fetchUpdateFigureStatusList(body);
    showResult(res);
    if (res.code !== API_CODE.OK) return;

    setStatusModalOpen(false);
    selection.exitMode();
    fetchReadFigureList();
  };

  return (
    <PageContainer>
      <PageHeader sx={{ mb: 1 }}>
        <PageTitle variant="h4" component="h1">
          상품
        </PageTitle>
        <FigureListActions
          mode={selection.mode}
          hasFigures={figures.length > 0}
          canChangeStatus={bulkTransition !== undefined}
          checkedCount={selection.checkedIds.length}
          shownCount={shownFigures.length}
          actionLabel={selection.mode === 'STATUS' ? getTransitionLabel(bulkTransition!) : '삭제'}
          onEnterMode={selection.enterMode}
          onExitMode={selection.exitMode}
          onToggleAll={selection.toggleAllFigures}
          onAction={selection.mode === 'STATUS' ? handleCheckedStatusChange : handleCheckedDelete}
          onInsert={() => navigate('/figures/new')}
        />
      </PageHeader>

      {figureList && figureList.code !== API_CODE.OK && <ErrorView message={figureList.message} onRetry={fetchReadFigureList} />}

      {figureList?.code === API_CODE.OK && (
        <>
          <TabRow>
            <FigureStatusTabs tab={tab} counts={countByTab(figures)} onChange={handleTabChange} />
            <FigureResultSummary
              count={shownFigures.length}
              totalPrice={sumTotalPrice(shownFigures)}
              paidAmount={sumPaidAmount(shownFigures)}
            />
          </TabRow>
          <Conditions>
            <FigureFilterBar
              options={options}
              filters={active.filters}
              month={active.month}
              sort={sort}
              onFilterChange={setFilter}
              onMonthChange={setMonth}
              onSortChange={setSort}
              onReset={resetFilters}
            />
            <FigureFilterChips filters={active.filters} options={options} onClear={(key) => setFilter(key, null)} />
          </Conditions>

          {figures.length === 0 && (
            <EmptyView
              message="등록한 상품이 없어요"
              action={
                <Button variant="contained" onClick={() => navigate('/figures/new')}>
                  상품 등록
                </Button>
              }
            />
          )}
          {figures.length > 0 && shownFigures.length === 0 && (
            <EmptyView
              message="조건에 맞는 상품이 없어요"
              action={<Button onClick={resetFilters}>필터 초기화</Button>}
            />
          )}
          {shownFigures.length > 0 && (
            <FigureListComponent
              key={listKey}
              figures={shownFigures}
              blinkUrgent={tab === 'UNPURCHASED'}
              onOpenDetail={handleOpenDetail}
              selectMode={selection.mode !== null}
              checkedIds={selection.checkedIds}
              onToggle={selection.toggleFigure}
            />
          )}
        </>
      )}

      {urgentOpen && <FigureUrgentModal figures={urgentFigures} onClose={handleUrgentClose} />}
      {statusModalOpen && (
        <FigureStatusModal
          title={getTransitionLabel(bulkTransition!)}
          transitions={[bulkTransition!]}
          totalPrice={0}
          loading={updateFigureStatusListLoading}
          onSubmit={handleStatusModalSubmit}
          onClose={() => setStatusModalOpen(false)}
        />
      )}

      <LoadingOverlay open={figureListLoading || deleteFigureListLoading || updateFigureStatusListLoading} />
    </PageContainer>
  );
};

export default FigureListPage;

/* ───────── styles ───────── */

/* 탭(왼쪽)과 결과 요약(오른쪽 끝)을 한 줄에 두고 아래에 선을 긋는다 */
const TabRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2.25),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

/* 필터 줄과 고른 필터 칩. 아래 카드 목록과는 크게 띄운다 */
const Conditions = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4.5),
}));
