import vue from 'eslint-plugin-vue'
import typescriptConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  vue.configs.recommended, // Vue 설정 추가
  typescriptConfig(), // TypeScript 설정 추가
  skipFormatting, // Prettier와의 충돌 방지 설정
]
