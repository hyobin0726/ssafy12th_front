<!-- CrewPage.vue -->
<template>
  <div class="h-screen flex flex-col">
    <!-- 심플한 헤더 -->
    <!-- Header -->
    <header class="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center">
          <!-- Logo -->
          <div class="flex items-center space-x-2 mr-8">
            <img src="../../assets/logo.svg" alt="Logo" class="h-6 w-auto" />
            <span class="font-bold text-lg">TRAVEL</span>
          </div>

          <!-- Navigation -->
          <div class="flex items-center flex-1">
            <button class="text-gray-700 hover:text-black text-sm font-medium">둘러보기</button>
            <button class="text-gray-700 hover:text-black text-sm font-medium">Map</button>
          </div>

          <!-- Search Bar -->
          <div class="relative flex items-center flex-1 max-w-[400px] mr-6">
            <input
              type="text"
              placeholder="여행지를 검색해보세요"
              class="w-full px-4 py-1.5 rounded border border-gray-300 focus:outline-none focus:border-gray-400 text-sm"
            />
            <button class="absolute right-0 h-full px-4 bg-black text-white text-sm font-medium rounded-r">
              Search
            </button>
          </div>

          <!-- 메뉴 드롭바 -->
          <div class="relative">
            <!-- 드롭다운 버튼 -->
            <button @click="toggleDropdown" class="px-4 py-2 bg-blue-500 text-white rounded-md">모임</button>

            <!-- 드롭다운 메뉴 -->
            <div v-if="isDropdownOpen" class="absolute mt-2 bg-white border rounded-md shadow-lg">
              <!-- 사용자가 가입한 모임 목록 -->
              <p>모임 리스트</p>
              <ul>
                <li
                  v-for="crew in myCrews"
                  :key="crew.crewId"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  @click="openCrewInfo(crew)"
                >
                  {{ crew.name }}
                </li>
              </ul>

              <!-- 모임 생성 버튼 -->
              <div class="border-t">
                <button @click="showCreateCrew" class="w-full px-4 py-2 text-left hover:bg-gray-100">모임 생성</button>
              </div>
              <!-- <button @click="handleViewCrew" class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                내 모임 조회
              </button> -->
              <!-- <button @click="handleLeaveCrew" class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                모임 나가기
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 모임 생성 컴포넌트 -->
    <CrewNewCreate v-if="isModalOpen" @close="closeModal" @fetchMyCrews="fetchMyCrews" />

    <!-- CrewInfo 모달 -->
    <CrewInfo
      v-if="isCrewInfoModalOpen"
      :isModalOpen="isCrewInfoModalOpen"
      :crewId="selectedCrew.crewId"
      :crewNameProp="selectedCrew.name"
      @close="closeCrewInfo"
      @updated="handleCrewUpdate"
      @leaved="handleCrewLeave"
      @deleted="handleCrewDelete"
    />

    <!-- 카카오맵 api & 지도 시군구 폴리곤 컴포넌트 -->
    <CrewMap />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import axios from 'axios'
import CrewNewCreate from '@/components/Crew/CrewNewCreate.vue'
import CrewInfo from '@/components/Crew/CrewInfo.vue'
import CrewMap from '@/components/Crew/CrewMap.vue'

export default defineComponent({
  components: {
    CrewNewCreate,
    CrewInfo,
    CrewMap,
  },
  setup() {
    // 드롭다운 상태 관리
    const isDropdownOpen = ref(false) // 드롭다운 메뉴 상태
    const isModalOpen = ref(false) // 모임 생성 컴포넌트 표시 상태
    const myCrews = ref<{ crewId: number; name: string }[]>([]) // 사용자의 모임 목록

    // 드롭다운 토글
    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    // 사용자의 모임 목록 조회
    const fetchMyCrews = async () => {
      const accessToken = sessionStorage.getItem('accessToken') // 인증 토큰 가져오기
      if (!accessToken) {
        console.error('Access token is missing')
        return
      }

      try {
        const response = await axios.get('http://localhost:8080/api/v1/crew/myCrew', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        myCrews.value = response.data // 반환된 모임 목록 저장
      } catch (error) {
        console.error('Failed to fetch crews:', error)
      }
    }

    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ모임 생성ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    //모임 생성
    const showCreateCrew = () => {
      console.log('모임페이지에서 생성 버튼 클릭')
      isModalOpen.value = true // 모임 생성 화면 표시
      isDropdownOpen.value = false // 드롭다운 닫기
    }

    // 모임 생성 화면 숨기기
    const closeModal = () => {
      isModalOpen.value = false
    }

    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ모임 조회ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    // 선택된 모임 정보
    const isCrewInfoModalOpen = ref(false)
    const selectedCrew = ref({ crewId: 0, name: '' })

    // 모임 선택
    const openCrewInfo = (crew: { crewId: number; name: string }) => {
      console.log('내 모임 조회 버튼 클릭')
      selectedCrew.value = crew
      isCrewInfoModalOpen.value = true
    }

    // 모임 정보 모달 닫기
    const closeCrewInfo = () => {
      isCrewInfoModalOpen.value = false
    }

    // 모임 업데이트 핸들러
    const handleCrewUpdate = (updatedCrew: { crewName: string; addedMembers: any[] }) => {
      console.log('모임 업데이트:', updatedCrew.addedMembers[0])
      alert(`모임이 업데이트되었습니다: ${updatedCrew.crewName}`)
      closeCrewInfo()
    }

    // 모임 나가기 핸들러
    const handleCrewLeave = (crewId: number) => {
      myCrews.value = myCrews.value.filter((crew) => crew.crewId !== crewId)
      closeCrewInfo()
    }

    // 모임 삭제 핸들러
    const handleCrewDelete = (crewId: number) => {
      myCrews.value = myCrews.value.filter((crew) => crew.crewId !== crewId)
      closeCrewInfo()
    }

    // 컴포넌트 마운트 시 초기화
    onMounted(() => {
      fetchMyCrews()
    })

    return {
      isDropdownOpen,
      //모임 생성
      showCreateCrew,
      isModalOpen,
      closeModal,
      fetchMyCrews, //컴포넌트로 보내기위해

      //모임 드롭바관련
      toggleDropdown,
      myCrews,

      //모임 조회
      openCrewInfo,
      closeCrewInfo,
      isCrewInfoModalOpen,
      selectedCrew,

      // 모임 업데이트 핸들러
      handleCrewUpdate,

      //모임 나가기 핸들러
      handleCrewLeave,

      // 모임 삭제 핸들러
      handleCrewDelete,
    }
  },
})
</script>

<style scoped>
/* 필요한 스타일 */
</style>
