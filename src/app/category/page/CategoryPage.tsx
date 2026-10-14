import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@mui/material';
import CategoryAxisTabs from '@/app/category/component/CategoryAxisTabs';
import CategoryFormDialog from '@/app/category/component/CategoryFormDialog';
import CategoryTree from '@/app/category/component/CategoryTree';
import {
  CATEGORY_AXES,
  DEFAULT_CATEGORY_AXIS,
  isCategoryAxisKey,
  type CategoryAxisKey,
  type CategoryLevel,
} from '@/app/category/constant/categoryAxes';
import type { CategoryItem } from '@/app/category/interface/CategoryItem';
import type { CategorySaveRequestBody } from '@/app/category/interface/CategorySaveRequestBody';
import useCreateCategory from '@/app/category/service/useCreateCategory';
import useDeleteCategory from '@/app/category/service/useDeleteCategory';
import useReadCategoryList from '@/app/category/service/useReadCategoryList';
import useReadCategoryUsage from '@/app/category/service/useReadCategoryUsage';
import useUpdateCategory from '@/app/category/service/useUpdateCategory';
import EmptyView from '@/app/common/component/EmptyView';
import ErrorView from '@/app/common/component/ErrorView';
import LoadingOverlay from '@/app/common/component/loading/LoadingOverlay';
import { PageContainer, PageHeader, PageTitle } from '@/app/common/style/CommonPage.style';
import { showConfirmAlert } from '@/app/common/utils/AlertUtils';
import { useUiStore } from '@/store/uiStore';

/** 열려 있는 추가/수정 창의 상태. 하위를 추가할 때는 속할 상위 id 를 가진다 */
type CategoryDialogState =
  | { mode: 'insert'; level: CategoryLevel; parentId?: number }
  | { mode: 'edit'; level: CategoryLevel; target: CategoryItem };

/**
 * 카테고리 관리 화면 (/categories)
 * 축(판매처, 형태, 시리즈, 장르·캐릭터, 제조사)은 주소의 ?axis= 로 바꾼다.
 * 추가, 수정, 삭제가 성공하면 목록을 다시 불러온다(수정, 삭제 응답에는 data 가 없다).
 */
const CategoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const showSnackbar = useUiStore((state) => state.showSnackbar);

  const { categoryList, categoryListLoading, fetchReadCategoryList } = useReadCategoryList();
  const { createCategoryLoading, fetchCreateCategory } = useCreateCategory();
  const { updateCategoryLoading, fetchUpdateCategory } = useUpdateCategory();
  const { deleteCategoryLoading, fetchDeleteCategory } = useDeleteCategory();
  const { categoryUsageLoading, fetchReadCategoryUsage } = useReadCategoryUsage();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [dialog, setDialog] = useState<CategoryDialogState | null>(null);

  const axisParam = searchParams.get('axis');
  const axis: CategoryAxisKey = isCategoryAxisKey(axisParam) ? axisParam : DEFAULT_CATEGORY_AXIS;
  /* 상위 이름: 하위가 없는 축(제조사)은 상위가 곧 분류라서 축 이름을 쓰고, 나머지는 "그룹" */
  const groupLabel = CATEGORY_AXES[axis].child === null ? CATEGORY_AXES[axis].nameKr : '그룹';
  const groups = categoryList?.data ?? [];
  const isBusy = categoryListLoading || createCategoryLoading || updateCategoryLoading || deleteCategoryLoading || categoryUsageLoading;

  useEffect(() => {
    fetchReadCategoryList(axis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axis]);

  const handleAxisChange = (nextAxis: CategoryAxisKey) => {
    setSelectedGroupId(null);
    setSearchParams({ axis: nextAxis });
  };

  const handleSave = async (body: CategorySaveRequestBody) => {
    if (dialog === null) return;

    const res =
      dialog.mode === 'insert'
        ? await fetchCreateCategory(axis, dialog.level, body, dialog.parentId)
        : await fetchUpdateCategory(axis, dialog.level, dialog.target.id, body);

    if (res.code !== 'OK') {
      showSnackbar(res.message, 'error');
      return;
    }

    showSnackbar(res.message, 'success');
    setDialog(null);

    /* 새로 만든 상위는 바로 오른쪽에 펼쳐 보여 준다 */
    if (dialog.mode === 'insert' && dialog.level === 'group' && res.data !== null) {
      setSelectedGroupId(res.data.id);
    }
    await fetchReadCategoryList(axis);
  };

  const handleDelete = async (level: CategoryLevel, target: CategoryItem) => {
    const usageRes = await fetchReadCategoryUsage(axis, level, target.id);
    if (usageRes.code !== 'OK' || usageRes.data === null) {
      showSnackbar(usageRes.message, 'error');
      return;
    }

    const usageText =
      usageRes.data.count === 0
        ? '이 분류를 쓰는 상품은 없어요.'
        : `이 분류를 쓰는 상품 ${usageRes.data.count}개는 '기타'로 옮겨져요.`;
    const groupText = level === 'group' && CATEGORY_AXES[axis].child !== null ? ' 하위 분류도 함께 \'기타\'로 옮겨져요.' : '';

    const confirmed = await showConfirmAlert({
      title: `'${target.name}'을(를) 삭제할까요?`,
      text: `${usageText}${groupText} 삭제하면 되돌릴 수 없어요.`,
      confirmText: '삭제',
      danger: true,
      focusCancel: true,
    });
    if (!confirmed) return;

    const res = await fetchDeleteCategory(axis, level, target.id);
    if (res.code !== 'OK') {
      showSnackbar(res.message, 'error');
      return;
    }

    showSnackbar(res.message, 'success');
    if (level === 'group' && target.id === selectedGroupId) setSelectedGroupId(null);
    await fetchReadCategoryList(axis);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle variant="h4" component="h1">
          카테고리 관리
        </PageTitle>
      </PageHeader>

      <CategoryAxisTabs axis={axis} onChange={handleAxisChange} />

      {categoryList && categoryList.code !== 'OK' && (
        <ErrorView message={categoryList.message} onRetry={() => fetchReadCategoryList(axis)} />
      )}
      {categoryList?.code === 'OK' && groups.length === 0 && (
        <EmptyView
          message={`등록된 ${groupLabel}이(가) 없어요`}
          action={
            <Button variant="contained" onClick={() => setDialog({ mode: 'insert', level: 'group' })}>
              {groupLabel} 추가
            </Button>
          }
        />
      )}
      {categoryList?.code === 'OK' && groups.length > 0 && (
        <CategoryTree
          axis={axis}
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
          onInsert={(level, parentId) => setDialog({ mode: 'insert', level, parentId })}
          onEdit={(level, target) => setDialog({ mode: 'edit', level, target })}
          onDelete={handleDelete}
        />
      )}

      {dialog && (
        <CategoryFormDialog
          mode={dialog.mode}
          levelName={dialog.level === 'group' ? groupLabel : '하위'}
          target={dialog.mode === 'edit' ? dialog.target : undefined}
          loading={createCategoryLoading || updateCategoryLoading}
          onSubmit={handleSave}
          onClose={() => setDialog(null)}
        />
      )}

      <LoadingOverlay open={isBusy} />
    </PageContainer>
  );
};

export default CategoryPage;
