import { Typography } from '@mui/material';
import { PageContainer, PageTitle } from '@/app/common/style/CommonPage.style';

interface ComingSoonPageProps {
  /** 아직 만들지 않은 화면의 이름 */
  title: string;
}

/*
* 임시 화면. 실제 화면을 만드는 번호에서 라우트 표(RoutesConfig)의 자리를 갈아 끼우고, 모두 끝나면 이 파일을 지운다.
* */
const ComingSoonPage = ({ title }: ComingSoonPageProps) => {
  return (
    <PageContainer>
      <PageTitle variant="h4" gutterBottom>
        {title}
      </PageTitle>
      <Typography color="text.secondary">아직 준비 중인 화면이에요.</Typography>
    </PageContainer>
  );
};

export default ComingSoonPage;
