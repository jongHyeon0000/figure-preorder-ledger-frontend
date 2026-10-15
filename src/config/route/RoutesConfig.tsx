import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import LoginPage from '@/app/auth/page/LoginPage';
import SignupPage from '@/app/auth/page/SignupPage';
import CategoryPage from '@/app/category/page/CategoryPage';
import FigureDetailPage from '@/app/figure/page/FigureDetailPage';
import FigureFormPage from '@/app/figure/page/FigureFormPage';
import FigureListPage from '@/app/figure/page/FigureListPage';
import ComingSoonPage from '@/app/common/page/ComingSoonPage';
import NotFoundPage from '@/app/common/page/NotFoundPage';

/** 라우트 종류. gnb 는 상단 메뉴에 나오는 라우트 */
export type RouteKind = 'root' | 'gnb' | 'login' | 'signup' | 'figure' | 'my-page' | 'my-page-sub' | 'not-found';

export type RouteType = {
  path: string;
  nameKr: string;
  element: ReactNode;
  type: RouteKind;
  /** true 면 로그인한 사용자만 들어갈 수 있다 */
  requireAuth: boolean;
};

/*
* 상단 메뉴(GNB)와 로그인 검사가 이 표 하나를 같이 쓴다.
* 마이페이지의 서브 라우트(/my-page/profile 등)는 여기에 넣지 않고 MyPageRoutes 에서만 정의한다.
* 아직 만들지 않은 화면은 ComingSoonPage 로 자리를 잡아 두고, 각 화면을 만드는 번호에서 갈아 끼운다.
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

  { path: '/my-page/*', nameKr: '마이페이지', element: <ComingSoonPage title="마이페이지" />, type: 'my-page', requireAuth: true },

  { path: '*', nameKr: '찾을 수 없음', element: <NotFoundPage />, type: 'not-found', requireAuth: false },
] as const;
