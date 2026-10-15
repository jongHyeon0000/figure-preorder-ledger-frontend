import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import LoginPage from '@/app/auth/page/LoginPage';
import SignupPage from '@/app/auth/page/SignupPage';
import CategoryPage from '@/app/category/page/CategoryPage';
import FigureDetailPage from '@/app/figure/page/FigureDetailPage';
import FigureFormPage from '@/app/figure/page/FigureFormPage';
import FigureListPage from '@/app/figure/page/FigureListPage';
import MyPagePage from '@/app/my-page/page/MyPagePage';
import NotFoundPage from '@/app/common/page/NotFoundPage';

/** 라우트 종류. gnb 는 상단 메뉴에 나오는 라우트 */
type RouteKind = 'root' | 'gnb' | 'login' | 'signup' | 'figure' | 'my-page' | 'not-found';

type RouteType = {
  path: string;
  nameKr: string;
  element: ReactNode;
  type: RouteKind;
  /** true 면 로그인한 사용자만 들어갈 수 있다 */
  requireAuth: boolean;
};

/*
* 상단 메뉴(GNB)와 로그인 검사가 이 표 하나를 같이 쓴다.
* 마이페이지는 탭을 화면 상태로 바꾸므로 서브 라우트가 없다.
* */
export const APP_ROUTES: readonly RouteType[] = [
  { path: '/', nameKr: '홈', element: <Navigate to="/figures" replace />, type: 'root', requireAuth: false },

  { path: '/login', nameKr: '로그인', element: <LoginPage />, type: 'login', requireAuth: false },
  { path: '/signup', nameKr: '회원가입', element: <SignupPage />, type: 'signup', requireAuth: false },

  { path: '/figures', nameKr: '상품', element: <FigureListPage />, type: 'gnb', requireAuth: true },
  { path: '/figures/new', nameKr: '상품 등록', element: <FigureFormPage mode="insert" />, type: 'figure', requireAuth: true },
  { path: '/figures/:figureId', nameKr: '상품 상세', element: <FigureDetailPage />, type: 'figure', requireAuth: true },
  { path: '/figures/:figureId/edit', nameKr: '상품 수정', element: <FigureFormPage mode="edit" />, type: 'figure', requireAuth: true },

  { path: '/categories', nameKr: '카테고리', element: <CategoryPage />, type: 'gnb', requireAuth: true },

  { path: '/my-page', nameKr: '마이페이지', element: <MyPagePage />, type: 'my-page', requireAuth: true },

  { path: '*', nameKr: '찾을 수 없음', element: <NotFoundPage />, type: 'not-found', requireAuth: false },
] as const;
