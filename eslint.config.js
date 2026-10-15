import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    /* 퍼블리싱 모듈화 강제: 화면 파일에는 sx 를 쓰지 않는다.
       스타일은 styled() 로 정의해서 공통 모듈(common/style)을 가져다 쓰고, 그 화면 전용 모양만 컴포넌트 파일 맨 아래에 둔다 */
    files: ['src/app/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='sx']",
          message: 'sx 는 쓰지 않는다. 스타일은 공통 모듈(common/style)을 가져다 쓰거나, 허락을 받아 styled() 로 정의한다.',
        },
      ],
    },
  },
])
