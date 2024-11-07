/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_AWS_S3_REGION: string
  readonly VITE_AWS_S3_BUCKET_NAME: string
  readonly VITE_AWS_S3_ACCESS_KEY: string
  readonly VITE_AWS_S3_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
