import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/app/common/style/CommonPage.style';
import { StateStack } from '@/app/common/style/CommonState.style';

/**
 * 없는 주소로 들어왔을 때 보여 주는 화면
 */
const NotFoundPage = () => {
  return (
    <PageContainer>
      <StateStack>
        <Typography variant="h2" color="primary">
          404
        </Typography>
        <Typography color="text.secondary">찾을 수 없는 페이지예요.</Typography>
        <Button variant="contained" component={Link} to="/">
          처음으로
        </Button>
      </StateStack>
    </PageContainer>
  );
};

export default NotFoundPage;
