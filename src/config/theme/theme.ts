import type { CSSProperties } from 'react'
import { createTheme } from '@mui/material/styles'

/*
* 색, 폰트, 둥근 정도는 이 파일에서만 정한다.
* 컴포넌트에서는 hex를 직접 쓰지 않고 theme.palette 를 참조한다.
*/

declare module '@mui/material/styles' {
  interface Palette {
    /** 카드, 입력창처럼 면 위에 한 단계 올라온 면 */
    surfaceRaised: string
    /** 면 안쪽을 나누는 옅은 선 */
    lineSubtle: string
    /** 목록 머리말처럼 면보다 한 단계 푹 꺼진 면 */
    surfaceSunken: string
    /** 줄무늬 목록의 홀수 줄 */
    rowStripe: string
    /** 줄무늬 목록의 짝수 줄 */
    rowStripeAlt: string
    /** 줄무늬 목록에서 마우스를 올린 줄 */
    rowHover: string
    /** 필터 드롭다운 카드(상위 목록). 화면 배경보다 확실히 밝다 */
    menuSurface: string
    /** 필터 드롭다운의 하위 목록 카드. 상위보다 한 단계 밝다 */
    menuSurfaceSub: string
    /** 필터 드롭다운 카드의 테두리 */
    menuLine: string
    /** 필터 드롭다운에서 열려 있는 상위 행 */
    menuOpen: string
    /** 필터 드롭다운에서 마우스를 올린 행 */
    menuHover: string
  }
  interface PaletteOptions {
    surfaceRaised?: string
    lineSubtle?: string
    surfaceSunken?: string
    rowStripe?: string
    rowStripeAlt?: string
    rowHover?: string
    menuSurface?: string
    menuSurfaceSub?: string
    menuLine?: string
    menuOpen?: string
    menuHover?: string
  }
  interface TypographyVariants {
    /** 가격, 날짜, 라벨처럼 숫자를 또렷하게 보여 줄 때 */
    mono: CSSProperties
  }
  interface TypographyVariantsOptions {
    mono?: CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    mono: true
  }
}

const FONT_BODY = '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif'
const FONT_DISPLAY = '"Do Hyeon", "Noto Sans KR", sans-serif'
const FONT_MONO = '"JetBrains Mono", "Noto Sans KR", monospace'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#e8b654', contrastText: '#100e1a' },
    secondary: { main: '#ff8fb3', contrastText: '#100e1a' },
    success: { main: '#7fd9a8', contrastText: '#100e1a' },
    warning: { main: '#f0a857', contrastText: '#100e1a' },
    error: { main: '#e8735f', contrastText: '#100e1a' },
    text: { primary: '#f1eefc', secondary: '#948db2' },
    background: { default: '#100e1a', paper: '#1b1830' },
    divider: '#3a3260',
    surfaceRaised: '#241f3d',
    lineSubtle: '#2a2548',
    surfaceSunken: '#0f0d1c',
    rowStripe: '#272145',
    rowStripeAlt: '#1f1a38',
    rowHover: '#322b58',
    menuSurface: '#2b2552',
    menuSurfaceSub: '#3a3270',
    menuLine: '#6a5fb0',
    menuOpen: '#453c85',
    menuHover: '#4a418f',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: FONT_BODY,
    h1: { fontFamily: FONT_DISPLAY, fontWeight: 400 },
    h2: { fontFamily: FONT_DISPLAY, fontWeight: 400 },
    h3: { fontFamily: FONT_DISPLAY, fontWeight: 400 },
    h4: { fontFamily: FONT_DISPLAY, fontWeight: 400 },
    h5: { fontFamily: FONT_DISPLAY, fontWeight: 400 },
    h6: { fontFamily: FONT_DISPLAY, fontWeight: 400 },
    button: { fontWeight: 500, textTransform: 'none' },
    mono: { fontFamily: FONT_MONO, fontSize: '0.875rem', letterSpacing: '0.02em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { minHeight: '100vh' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 16 } },
    },
  },
})

export default theme
