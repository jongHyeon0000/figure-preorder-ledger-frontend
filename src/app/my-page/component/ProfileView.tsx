import dayjs from 'dayjs';
import { Button } from '@mui/material';
import ThumbnailUploader from '@/app/common/component/ThumbnailUploader';
import type { ThumbnailChange } from '@/app/common/interface/ThumbnailChange';
import { ColumnCard, MediaCard } from '@/app/common/style/CommonCard.style';
import { EndRow, SplitLayout } from '@/app/common/style/CommonLayout.style';
import { SquareFrame } from '@/app/common/style/CommonMedia.style';
import { LabelText, LabelValueGrid, LabelValueRow, ValueText } from '@/app/common/style/CommonText.style';
import type { UserInfo } from '@/app/auth/interface/UserInfo';
import { styled } from '@mui/material/styles';

interface ProfileViewProps {
  /** 보여 줄 내 정보 */
  user: UserInfo;

  /** 지금 고른 프로필 이미지 변경 사항 */
  thumbnail: ThumbnailChange;

  /** 프로필 이미지 변경 사항이 바뀌었을 때 */
  onThumbnailChange: (change: ThumbnailChange) => void;

  /** 저장 요청 중이면 막는다 */
  loading: boolean;

  /** 저장 버튼 (서버 요청은 페이지가 한다) */
  onSave: () => void;
}

/**
 * 내 정보 탭. 왼쪽은 프로필 이미지 카드(고르면 저장 버튼으로 올린다), 오른쪽은 아이디, 이메일, 닉네임, 가입일(표시 전용).
 * 상품 상세와 같은 1:2 배치이고, 저장 버튼은 오른쪽 카드의 맨 아래 오른쪽이다.
 */
const ProfileView = ({ user, thumbnail, onThumbnailChange, loading, onSave }: ProfileViewProps) => {
  return (
    <SplitLayout>
      <MediaCard>
        <SquareFrame>
          <ThumbnailUploader currentUrl={user.thumbnailUrl} value={thumbnail} onChange={onThumbnailChange} disabled={loading} />
        </SquareFrame>
      </MediaCard>
      <ColumnCard>
        <Info>
          <LabelValueRow>
            <LabelText>아이디</LabelText>
            <ValueText>{user.loginId}</ValueText>
          </LabelValueRow>
          <LabelValueRow>
            <LabelText>이메일</LabelText>
            <ValueText>{user.email}</ValueText>
          </LabelValueRow>
          <LabelValueRow>
            <LabelText>닉네임</LabelText>
            <ValueText>{user.name}</ValueText>
          </LabelValueRow>
          <LabelValueRow>
            <LabelText>가입일</LabelText>
            <ValueText>{dayjs(user.createdAt).format('YYYY.MM.DD')}</ValueText>
          </LabelValueRow>
        </Info>
        <ButtonRow>
          <Button variant="contained" disabled={loading || thumbnail.type === 'none'} onClick={onSave}>
            저장
          </Button>
        </ButtonRow>
      </ColumnCard>
    </SplitLayout>
  );
};

export default ProfileView;

/* ───────── styles ───────── */

/* 정보 줄 사이를 넉넉히 띄운다 */
const Info = styled(LabelValueGrid)(({ theme }) => ({
  rowGap: theme.spacing(2),
}));

/* 카드가 길어져도 저장 버튼은 맨 아래 오른쪽에 붙는다 */
const ButtonRow = styled(EndRow)({
  marginTop: 'auto',
});
