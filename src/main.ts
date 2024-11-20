import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './main.css'
import { useKakao } from 'vue3-kakao-maps/@utils'
import { VueQueryPlugin, QueryClient, type VueQueryPluginOptions } from '@tanstack/vue-query'

useKakao(import.meta.env.VITE_KAKAO_MAPS_API_KEY)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // 요청 실패 시 재시도 횟수
      staleTime: 1000 * 60, // 데이터가 신선한 상태로 유지될 시간 (1분)
    },
  },
})

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClient,
}
const app = createApp(App)

// Pinia 생성 및 등록
const pinia = createPinia()
app.use(VueQueryPlugin, vueQueryPluginOptions)
app.use(pinia)
app.use(router)
app.mount('#app')
