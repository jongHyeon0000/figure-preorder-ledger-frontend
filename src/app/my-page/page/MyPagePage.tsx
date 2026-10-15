import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab } from '@mui/material';
import LoadingOverlay from '@/app/common/component/loading/LoadingOverlay';
import type { ThumbnailChange } from '@/app/common/interface/ThumbnailChange';
import { PageContainer, PageHeader, PageTitle } from '@/app/common/style/CommonPage.style';
import { UnderlineTabs } from '@/app/common/style/CommonTabs.style';
import useDeleteThumbnail from '@/app/common/service/useDeleteThumbnail';
import useUploadThumbnail from '@/app/common/service/useUploadThumbnail';
import { showConfirmAlert } from '@/app/common/utils/AlertUtils';
import type { WithdrawRequestBody } from '@/app/auth/interface/WithdrawRequestBody';
import useAuth from '@/app/auth/service/useAuth';
import useReadMe from '@/app/auth/service/useReadMe';
import useWithdraw from '@/app/auth/service/useWithdraw';
import ProfileView from '@/app/my-page/component/ProfileView';
import WithdrawForm from '@/app/my-page/component/WithdrawForm';
import { isMyPageTabKey, MY_PAGE_TABS, type MyPageTabKey } from '@/app/my-page/constant/myPageTab';
import { API_CODE } from '@/config/axios/constant/apiCode';
import { useUiStore } from '@/store/uiStore';

const WITHDRAW_ALERT = {
  title: '정말 탈퇴할까요?',
  text: '모든 상품, 분류, 이미지가 삭제되고 되돌릴 수 없어요.',
  confirmText: '탈퇴',
};

/**
 * 마이페이지 (/my-page)
 * 내 정보(프로필 이미지 포함)와 회원 탈퇴를 탭으로 나눈다. 탭은 주소 없이 화면 상태로만 바꾼다.
 */
const MyPagePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { meLoading, fetchReadMe } = useReadMe();
  const { uploadThumbnailLoading, fetchUploadThumbnail } = useUploadThumbnail();
  const { deleteThumbnailLoading, fetchDeleteThumbnail } = useDeleteThumbnail();
  const { withdrawLoading, fetchWithdraw } = useWithdraw();
  const showResult = useUiStore((state) => state.showResult);
  const [tab, setTab] = useState<MyPageTabKey>('PROFILE');
  const [thumbnail, setThumbnail] = useState<ThumbnailChange>({ type: 'none' });

  const handleTabChange = (_event: SyntheticEvent, value: string) => {
    if (isMyPageTabKey(value)) setTab(value);
  };

  /* 고른 프로필 이미지를 올리거나 지우고, 헤더 아이콘도 바뀌도록 내 정보를 다시 불러온다 */
  const handleThumbnailSave = async () => {
    if (thumbnail.type === 'none') return;

    const res =
      thumbnail.type === 'upload'
        ? await fetchUploadThumbnail('user', user!.userId, thumbnail.file)
        : await fetchDeleteThumbnail('user', user!.userId);
    showResult(res);
    if (res.code !== API_CODE.OK) return;

    setThumbnail({ type: 'none' });
    await fetchReadMe();
  };

  const handleWithdraw = async (body: WithdrawRequestBody) => {
    const confirmed = await showConfirmAlert({ ...WITHDRAW_ALERT, danger: true, focusCancel: true });
    if (!confirmed) return;

    const res = await fetchWithdraw(body);
    showResult(res);
    if (res.code !== API_CODE.OK) return;

    logout();
    navigate('/login', { replace: true });
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle variant="h4" component="h1">
          마이페이지
        </PageTitle>
      </PageHeader>

      <UnderlineTabs value={tab} onChange={handleTabChange}>
        {Object.entries(MY_PAGE_TABS).map(([key, name]) => (
          <Tab key={key} value={key} label={name} />
        ))}
      </UnderlineTabs>

      {tab === 'PROFILE' && (
        <ProfileView
          user={user!}
          thumbnail={thumbnail}
          onThumbnailChange={setThumbnail}
          loading={uploadThumbnailLoading || deleteThumbnailLoading || meLoading}
          onSave={handleThumbnailSave}
        />
      )}
      {tab === 'WITHDRAW' && <WithdrawForm loading={withdrawLoading} onSubmit={handleWithdraw} />}

      <LoadingOverlay open={uploadThumbnailLoading || deleteThumbnailLoading || meLoading || withdrawLoading} />
    </PageContainer>
  );
};

export default MyPagePage;
