import DOMPurify from 'dompurify';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BASE_URL } from '@/config/axios/AxiosConfig';

interface HtmlViewProps {
  /** 서버에 저장된 HTML (에디터 결과) */
  html: string;
}

/**
 * 설명 HTML을 정화(DOMPurify)해서 보여 준다. 앱에서 dangerouslySetInnerHTML 을 쓰는 곳은 여기 한 곳뿐이다.
 * 저장된 이미지 주소는 '/uploads/...' 상대 경로라서, 화면에 그릴 때만 서버 주소를 붙인다(저장 값은 그대로).
 */
const HtmlView = ({ html }: HtmlViewProps) => {
  const clean = DOMPurify.sanitize(html).replaceAll('src="/uploads/', `src="${BASE_URL}/uploads/`);

  return <Content dangerouslySetInnerHTML={{ __html: clean }} />;
};

export default HtmlView;

/* ───────── styles ───────── */

const Content = styled(Box)({
  wordBreak: 'break-word',
  '& img': { display: 'block', maxWidth: '100%', height: 'auto' },
});
