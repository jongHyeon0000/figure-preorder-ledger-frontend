import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    /* 백엔드 local CORS가 5173만 허용하므로 포트가 밀리지 않게 고정한다 */
    port: 5173,
    strictPort: true,
    /*
    * 백엔드 주소는 환경마다 다르다.
    *  - local: 이 프록시가 localhost:8080 으로 /api, /uploads 요청을 중계한다 (npm run dev 로 뜬 서버에서만 동작)
    *  - prod : Vite 서버가 없어서 이 설정은 쓰이지 않는다. 브라우저 코드가 .env.production 의 VITE_PROD_API_BASE_URL 을 읽는다
    */
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
      '/uploads': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
