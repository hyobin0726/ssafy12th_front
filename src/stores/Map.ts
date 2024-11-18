import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
  state: () => ({
    lat: 37.566826, // 기본 위도
    lng: 126.9786567, // 기본 경도
  }),
  actions: {
    setCoordinates(newLat: number, newLng: number) {
      this.lat = newLat
      this.lng = newLng
    },
  },
})
