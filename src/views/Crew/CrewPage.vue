<!-- KoreaMap.vue -->
<template>
  <div class="h-screen flex flex-col">
    <!-- 심플한 헤더 -->
    <header class="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      <div class="flex items-center">
        <img src="../../assets/logo.svg" alt="Logo" class="h-8" />
      </div>
      <div class="flex items-center gap-4 relative">
        <div
          class="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
          @click="isNavOpen = !isNavOpen"
        >
          <img :src="userProfile" alt="Profile" class="h-9 w-9 rounded-full border-2 border-gray-100" />
          <ChevronDown class="w-5 h-5 text-gray-500 transition-transform" :class="{ 'rotate-180': isNavOpen }" />
        </div>

        <!-- Nav 메뉴 -->
        <div
          v-if="isNavOpen"
          class="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
        >
          <button
            v-for="(item, index) in navItems"
            :key="index"
            @click="item.action"
            class="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50"
            :class="{ 'text-red-600 hover:bg-red-50': item.danger }"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.label }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 카카오맵 -->
    <div class="flex-1" id="map" style="width: 100%; height: calc(100vh - 64px)"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const map = ref<kakao.maps.Map | null>(null)
const polygons = ref<kakao.maps.Polygon[]>([])
const detailMode = ref(false)

// 초기화 함수
const initializeMap = () => {
  const mapContainer = document.getElementById('map')
  if (!mapContainer) return

  map.value = new kakao.maps.Map(mapContainer, {
    center: new kakao.maps.LatLng(37.566826, 126.9786567), // 서울 중심 좌표
    level: 12,
  })

  kakao.maps.event.addListener(map.value, 'zoom_changed', handleZoomChange)

  loadPolygons('sido.json') // 초기 시도 폴리곤 로드
}

// 줌 변경 이벤트 핸들러
const handleZoomChange = () => {
  if (!map.value) return

  const level = map.value.getLevel()
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
    const response = await axios.get(`/${url}`) // JSON 파일 경로 수정
    const features = response.data.features

    features.forEach((feature: any) => {
      const path = feature.geometry.coordinates[0].map((coord: number[]) => new kakao.maps.LatLng(coord[1], coord[0]))

      const polygon = new kakao.maps.Polygon({
        map: map.value,
        path: path,
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
        alert(`선택된 지역: ${feature.properties.name}`)
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

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  initializeMap()
})
</script>

<style scoped>
/* 필요한 스타일 */
</style>
