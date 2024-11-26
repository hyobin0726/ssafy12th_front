<!-- CrewPage.vue -->
<template>
  <div class="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
    <Nav class="mb-2 h-[100px]" />
    <!-- CrewStart  조건부 렌더링 -->
    <CrewStart v-if="myCrews.length === 0" @crewCreated="fetchMyCrews" :onCreated="fetchMyCrews" />
    <!-- 모임이 있을 때 기존 화면 -->
    <template v-else>
      <!-- 기존 CrewPage 템플릿 -->
      <!-- 드롭다운 버튼 -->
      <div class="relative">
        <button
          @click="toggleDropdown"
          class="fixed top-[120px] right-5 bg-gradient-to-r from-green to-[#BCC199] text-white py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse-subtle z-50 font-semibold tracking-wide"
        >
          <span class="flex items-center gap-2">
            모임
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-transform duration-300"
              :class="{ 'rotate-180': isDropdownOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        <!-- 드롭다운 메뉴 -->
        <div
          v-if="isDropdownOpen"
          class="absolute top-28 right-5 w-80 bg-white rounded-lg shadow-lg transform transition-all duration-300 ease-out z-50 border border-[#D9D5C3]"
        >
          <!-- 모임 리스트 헤더 -->
          <div class="px-4 py-3 rounded-t-lg border-b border-[#D9D5C3]">
            <h3 class="text-lg font-bold text-gray-800">모임 리스트</h3>
          </div>

          <!-- 사용자가 가입한 모임 목록 -->
          <ul class="max-h-96 overflow-y-auto divide-y divide-[#D9D5C3]">
            <li
              v-for="(crew, index) in myCrews"
              :key="crew.crewId"
              class="px-4 py-3 transition-all duration-200 cursor-pointer"
              :class="[
                selectedCrew.crewId === crew.crewId
                  ? 'bg-[#D3CDAD] text-white opacity-60'
                  : 'bg-white hover:bg-[#F3F1E9] text-gray-800',
              ]"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="flex justify-between items-center">
                <span
                  @click="handleCrewSelect(crew)"
                  class="font-medium flex-grow truncate transition-all duration-300"
                  :class="[
                    selectedCrew.crewId === crew.crewId ? 'text-black font-bold' : 'text-gray-800 hover:text-[#A8B087]',
                  ]"
                >
                  {{ crew.name }}
                </span>
                <button
                  @click.stop="openCrewInfo(crew)"
                  class="px-3 py-1 text-sm rounded-md bg-[#8D9363] text-white font-medium shadow-sm hover:shadow-lg hover:scale-105 transform transition-all"
                >
                  상세보기
                </button>
              </div>
            </li>
          </ul>

          <!-- 모임 생성 버튼 -->
          <div class="px-4 py-3 rounded-b-lg hover:bg-[#BCC199] focus:outline-none focus:border-[#BCC199]">
            <button
              @click="showCreateCrew"
              class="w-full text-left text-stone-600 font-medium transition-all duration-300"
            >
              + 새로운 모임 만들기
            </button>
          </div>
        </div>
      </div>

      <!-- 모임 생성 컴포넌트 -->
      <CrewNewCreate v-if="isModalOpen" @close="closeModal" @fetchMyCrews="fetchMyCrews" />

      <!-- CrewInfo 모달 -->
      <CrewInfo
        v-if="isCrewInfoModalOpen"
        :isModalOpen="isCrewInfoModalOpen"
        :crewId="selectedCrew.crewId"
        :crewNameProp="selectedCrew.name"
        :crewUsersProp="crewUsers"
        @close="closeCrewInfo"
        @updated="handleCrewUpdate"
        @leaved="handleCrewLeave"
        @deleted="handleCrewDelete"
      />

      <!-- 카카오맵 api & 지도 시군구 폴리곤 컴포넌트 -->
      <CrewMap :currentCrewReview="currentCrewReview" />
    </template>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import axios from 'axios'
import CrewNewCreate from '@/components/Crew/CrewNewCreate.vue'
import CrewInfo from '@/components/Crew/CrewInfo.vue'
import CrewMap from '@/components/Crew/CrewMap.vue'
import type { Review } from '@/types/Review'
import type { CrewUser } from '@/types/CrewUser'
import CrewStart from '@/components/Crew/CrewStart.vue'
import Nav from '@/components/common/WhiteNav.vue'
import { useToast } from 'vue-toast-notification'
export default defineComponent({
  components: {
    CrewNewCreate,
    CrewInfo,
    CrewMap,
    CrewStart,
    Nav,
  },

  setup() {
    // 드롭다운 상태 관리
    const isDropdownOpen = ref(false) // 드롭다운 메뉴 상태
    const isModalOpen = ref(false) // 모임 생성 컴포넌트 표시 상태
    const myCrews = ref<{ crewId: number; name: string }[]>([]) // 사용자의 모임 목록

    // 선택된 모임 정보
    const isCrewInfoModalOpen = ref(false)
    const selectedCrew = ref({ crewId: 0, name: '' })
    const crewUsers = ref<CrewUser[]>([]) // 사용자의 모임 목록

    // 현재 모임 선택 후 모임 리뷰 담기
    const currentCrewReview = ref<Review[]>([])
    // const currentCrewReview = ref<Review[]>([
    //   // 해당 모임 리뷰 목록
    //   { gugunId: 1, gugunSidoId: 11 },
    //   { gugunId: 2, gugunSidoId: 22 },
    //   // 초기 데이터 샘플
    // ])

    // 드롭다운 토글
    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    // 모임 선택 핸들러 추가
    const handleCrewSelect = (crew: { crewId: number; name: string }) => {
      selectedCrew.value = crew
      fetchCrewReviews(crew.crewId)
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

    // 모임 리뷰 조회
    const fetchCrewReviews = async (crewId: number) => {
      console.log(`리뷰 조회: 크루 ID ${crewId}`)
      try {
        const accessToken = sessionStorage.getItem('accessToken')
        if (!accessToken) {
          console.error('Access token is missing')
          return
        }
        const response = await axios.get(`http://localhost:8080/api/v1/reviews/crew/${crewId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        console.log('리뷰 데이터:', response.data)
        currentCrewReview.value = response.data // 반환된 모임 목록 저장
        console.log('리뷰 데이터2:', currentCrewReview.value)
      } catch (error) {
        console.error('리뷰 조회 실패:', error)
      }
    }

    //리뷰를 시군구 별로 선별해서 구분하는 함수 currentCrewReview이용하면됨
    //////

    // 모임 생성 화면 숨기기
    const closeModal = () => {
      isModalOpen.value = false
    }

    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ모임 정보 조회 & 모임 리뷰 조회ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    // 모임 선택
    const openCrewInfo = (crew: { crewId: number; name: string }) => {
      console.log('내 모임 조회 버튼 클릭')
      selectedCrew.value = crew
      CrewUsersList(crew.crewId)
    }

    const CrewUsersList = async (crewId: number) => {
      try {
        //모임에 대한 정보 조회
        const response = await axios.get(`http://localhost:8080/api/v1/crew/${crewId}/details`)
        crewUsers.value = response.data.users // 서버 응답 데이터 저장
        console.log('Crew Users:', crewUsers.value)
        isCrewInfoModalOpen.value = true
      } catch (error) {
        console.error('Failed to fetch crew users:', error)
      }
    }

    // 모임 정보 모달 닫기
    const closeCrewInfo = () => {
      isCrewInfoModalOpen.value = false
    }

    // 모임 업데이트 핸들러
    const handleCrewUpdate = (updatedCrew: { crewName: string; addedMembers: any[] }) => {
      // alert(`모임 수정 버튼 클릭 - ${updatedCrew.crewName}`)
      fetchMyCrews()
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
      fetchCrewReviews,

      //모임 드롭바관련
      toggleDropdown,
      myCrews,
      handleCrewSelect, // 새로운 핸들러 추가

      //모임 조회
      openCrewInfo,
      CrewUsersList,
      crewUsers,
      closeCrewInfo,
      isCrewInfoModalOpen,
      selectedCrew,
      currentCrewReview,

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

<style>
@keyframes pulseSubtle {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

@keyframes dropdownFade {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-pulse-subtle {
  animation: pulseSubtle 2s infinite;
}

.animate-dropdown-fade {
  animation: dropdownFade 0.3s ease-out forwards;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* 스크롤바 스타일링 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #10b981 #e5e7eb;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #e5e7eb;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #10b981;
  border-radius: 3px;
}

/* 그라데이션 텍스트를 위한 추가 스타일 */
.text-gradient {
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}

@keyframes selectedPulse {
  0% {
    opacity: 0.9;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.9;
  }
}

.selected-crew {
  animation: selectedPulse 2s infinite;
}
</style>
