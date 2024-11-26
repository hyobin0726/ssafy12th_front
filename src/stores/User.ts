// stores/User.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('User', {
  state: () => ({
    token: '', // 사용자 토큰 상태
  }),
  actions: {
    setUser(token: string) {
      this.token = token
    },
  },
})
