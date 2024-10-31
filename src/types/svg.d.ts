// src/shims-vue.d.ts
declare module '*.svg' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
