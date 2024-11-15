<template>
  <KakaoMap :lat="lat" :lng="lng" :width="'100%'" :height="'100vh'" v-if="loaded">
    <div class="fixed z-50 p-5">
      <MapModal class="" />
    </div>
  </KakaoMap>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import { KakaoMap } from 'vue3-kakao-maps'
import MapModal from '@/components/Map/MapModal.vue'

export default defineComponent({
  components: { KakaoMap, MapModal },
  setup() {
    const lat = ref(37.566826)
    const lng = ref(126.9786567)
    const loaded = ref(false)
    // 사용자의 현재 위치를 가져오는 함수
    onMounted(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            lat.value = position.coords.latitude
            lng.value = position.coords.longitude
            loaded.value = true
          },
          (error) => {
            console.error('위치 정보를 가져오는 데 실패했습니다:', error)
            loaded.value = true // 오류 발생 시에도 기본 위치를 보여줌
          },
        )
      } else {
        console.error('Geolocation을 지원하지 않는 브라우저입니다.')
        loaded.value = true
      }
    })
    return { lat, lng, loaded }
  },
})
</script>

<style scoped>
.modal {
  /* position: fixed; */
  /* top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;
  text-align: center; */
  /* z-index: 9999; */
}
</style>
