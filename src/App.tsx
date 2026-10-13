import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Box } from '@mui/material'
import RequireAuth from '@/app/auth/RequireAuth'
import useInitAuth from '@/app/auth/service/useInitAuth'
import GNB from '@/app/common/component/GNB'
import GlobalSnackbar from '@/app/common/component/GlobalSnackbar'
import LoadingOverlay from '@/app/common/component/loading/LoadingOverlay'
import { APP_ROUTES } from '@/config/route/RoutesConfig'
import { useAuthStore } from '@/store/authStore'

const AppContent = () => {
  /* 쿠키 토큰으로 로그인 상태를 복원한다. 끝나기 전에는 화면을 그리지 않는다(로그인 화면이 잠깐 비치는 것을 막는다) */
  useInitAuth()
  const isInitialized = useAuthStore((state) => state.isInitialized)

  if (!isInitialized) return <LoadingOverlay open />

  return (
    <>
      <GNB />
      <Box component="main">
        <Routes>
          {APP_ROUTES.filter((route) => !route.requireAuth).map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route element={<RequireAuth />}>
            {APP_ROUTES.filter((route) => route.requireAuth).map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Routes>
      </Box>
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
      <GlobalSnackbar />
    </BrowserRouter>
  )
}

export default App
