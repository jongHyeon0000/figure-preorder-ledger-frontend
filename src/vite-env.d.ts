/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * prod에서 브라우저가 호출할 백엔드 API 서버 주소(.env.production에서 정한다).
   * local은 Vite 프록시(vite.config.ts)가 백엔드로 중계하므로 정하지 않는다.
   * 비어 있으면 같은 출처로 호출한다.
   */
  readonly VITE_PROD_API_BASE_URL?: string;
}