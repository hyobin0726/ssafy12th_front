<template>
  <!--ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ카카오맵ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ-->
  <div class="flex-1" id="map" style="width: 100%; height: calc(100vh - 64px)"></div>
  <!-- Modal Toggle Button -->
  <button
    class="fixed top-20 left-5 bg-green-500 text-white p-3 rounded-full shadow-lg z-50"
    @click="isModalOpen = !isModalOpen"
  >
    {{ isModalOpen ? '모달 닫기' : '모달 열기' }}
  </button>

  <!-- Modal -->
  <div v-if="isModalOpen" class="fixed top-20 left-16 bg-white shadow-md border rounded-lg w-80 z-50 p-4">
    <h2 class="text-xl font-bold mb-2">선택된 지역 정보</h2>
    <div v-if="selectedRegion">
      <p class="text-gray-800 font-medium">시도: {{ selectedRegion.sido }}</p>
      <p class="text-gray-800 font-medium">시군구: {{ selectedRegion.sigungu }}</p>
      <p class="text-gray-800 font-medium">이름: {{ selectedRegion.sigkornm }}</p>
    </div>
    <p v-else class="text-gray-500">아직 지역을 선택하지 않았습니다.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'

export default defineComponent({
  setup(props) {
    // 맵관련ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    // 지도 및 폴리곤 관련 상태
    const kakaoMap = ref<kakao.maps.Map | undefined>(undefined)
    const polygons = ref<kakao.maps.Polygon[]>([])
    const detailMode = ref(false)
    const isModalOpen = ref(false) // 맵 모달 상태
    const selectedRegion = ref<{ sido: string; sigungu: string; sigkornm: string } | null>(null)

    // 스크립트 동적 로드
    const loadKakaoMapScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (document.getElementById('kakao-map-script')) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.id = 'kakao-map-script'
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${import.meta.env.VITE_KAKAO_MAPS_API_KEY}`
        script.onload = () => {
          kakao.maps.load(() => resolve())
        }
        script.onerror = () => reject(new Error('카카오맵 스크립트를 로드하지 못했습니다.'))
        document.head.appendChild(script)
      })
    }

    // 지도 초기화
    const initializeMap = () => {
      const mapContainer = document.getElementById('map')
      if (!mapContainer) return

      kakaoMap.value = new kakao.maps.Map(mapContainer, {
        center: new kakao.maps.LatLng(37.566826, 126.9786567),
        level: 12,
      })

      kakao.maps.event.addListener(kakaoMap.value, 'zoom_changed', handleZoomChange)
      loadPolygons('sido.json') // 초기 폴리곤 로드
    }

    // 줌 변경 이벤트 핸들러
    const handleZoomChange = () => {
      if (!kakaoMap.value) return

      const level = kakaoMap.value.getLevel()
      if (detailMode.value && level > 10) {
        detailMode.value = false
        clearPolygons()
        loadPolygons('sido.json')
      } else if (!detailMode.value && level <= 10) {
        detailMode.value = true
        clearPolygons()
        loadPolygons('sigungu.json')
      }
    }

    // 폴리곤 데이터 로드
    const loadPolygons = async (url: string) => {
      try {
        const response = await axios.get(`/${url}`)
        const features = response.data.features

        features.forEach((feature: any) => {
          const path = feature.geometry.coordinates[0].map(
            (coord: number[]) => new kakao.maps.LatLng(coord[1], coord[0]),
          )

          const polygon = new kakao.maps.Polygon({
            map: kakaoMap.value,
            path,
            strokeWeight: 2,
            strokeColor: '#004c80',
            strokeOpacity: 0.8,
            fillColor: '#fff',
            fillOpacity: 0.7,
          })

          polygons.value.push(polygon)

          kakao.maps.event.addListener(polygon, 'mouseover', () => {
            polygon.setOptions({ fillColor: '#09f' })
          })

          kakao.maps.event.addListener(polygon, 'mouseout', () => {
            polygon.setOptions({ fillColor: '#fff' })
          })

          kakao.maps.event.addListener(polygon, 'click', () => {
            selectedRegion.value = {
              sido: feature.properties.CTP_ENG_NM || 'N/A',
              sigungu: feature.properties.SIG_ENG_NM || 'N/A',
              sigkornm: feature.properties.SIG_KOR_NM || 'N/A',
            }
            isModalOpen.value = true
          })
        })
      } catch (error) {
        console.error('폴리곤 데이터 로드 실패:', error)
      }
    }
    // 폴리곤 제거
    const clearPolygons = () => {
      polygons.value.forEach((polygon) => polygon.setMap(null))
      polygons.value = []
    }

    onMounted(async () => {
      try {
        await loadKakaoMapScript() // Kakao Maps 스크립트 로드
        initializeMap() // 지도 초기화
      } catch (error) {
        console.error('카카오맵 초기화 실패:', error)
      }
    })

    return {
      isModalOpen,
      selectedRegion,
    }
  },
})
</script>

<style scoped>
/* Tailwind 스타일 사용 */
</style>
