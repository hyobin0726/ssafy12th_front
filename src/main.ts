import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './main.css'
import { useKakao } from 'vue3-kakao-maps/@utils'

useKakao(import.meta.env.VITE_KAKAO_MAPS_API_KEY)

const app = createApp(App)

// Pinia 생성 및 등록
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
