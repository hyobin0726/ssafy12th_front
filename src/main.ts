import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css'
import { useKakao } from 'vue3-kakao-maps/@utils'

useKakao(import.meta.env.VITE_KAKAO_MAPS_API_KEY)
createApp(App).use(router).mount('#app')
