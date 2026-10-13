import { Typography } from '@mui/material'
import GlobalSnackbar from '@/app/common/component/GlobalSnackbar'

/* 3번에서 라우트와 GNB 로 교체한다 */
const App = () => {
  return (
    <>
      <Typography variant="h4" sx={{ p: 3 }}>
        피규어 예약 장부
      </Typography>
      <GlobalSnackbar />
    </>
  )
}

export default App
