<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- 비디오 섹션 -->
    <section class="relative h-[300vh]">
      <!-- 3배 높이로 설정 -->
      <video autoplay muted loop class="w-full h-full object-cover sticky top-0">
        <source src="@/assets/MainView.mp4" type="video/mp4" />
      </video>

      <header class="absolute top-0 w-full z-50 transition-all duration-300 p-6">
        <div class="flex items-center justify-between py-4">
          <div class="flex items-center space-x-16">
            <router-link to="/" class="flex items-center">
              <img src="@/assets/logo.svg" alt="Logo" class="h-8 w-auto text-white" />
            </router-link>
            <nav class="flex items-center space-x-16">
              <router-link to="/map" class="text-white text-lg font-medium hover:text-green"> 지도 </router-link>
              <router-link to="/crewPage" class="text-white text-lg font-medium hover:text-green"> 모임 </router-link>
              <router-link to="/chat" class="text-white text-lg font-medium hover:text-green"> 채팅 </router-link>
              <router-link to="/reviewList" class="text-white text-lg font-medium hover:text-green"> 리뷰 </router-link>
            </nav>
          </div>

          <div class="flex items-center space-x-4">
            <button
              class="px-4 py-2 bg-black bg-opacity-30 h-11 text-white text-sm font-medium rounded hover:bg-opacity-50"
              @click="openLoginModal"
            >
              로그인
            </button>
            <button
              class="px-4 py-2 bg-black bg-opacity-30 h-11 text-white text-sm font-medium rounded hover:bg-opacity-50"
              @click="openSignUpModal"
            >
              회원가입
            </button>
          </div>
        </div>
      </header>
      <LoginModal @close="closeLoginModal" :isVisible="isLoginModalOpen" />
      <SignUp @close="closeSignUpModal" :isVisible="isSignUpModalOpen" />

      <!-- 3개의 텍스트 섹션 -->
      <div
        v-for="(text, idx) in texts"
        :key="text"
        class="absolute w-full h-screen flex items-center justify-center"
        :style="{ top: `${idx * 100}vh` }"
      >
        <div class="bg-black/30 w-full h-full flex items-center justify-center">
          <h1
            class="text-white text-6xl font-bold tracking-wider"
            :class="textVisible[idx] ? 'animate-textSlideIn' : ''"
          >
            {{ text }}
          </h1>
        </div>
      </div>
    </section>

    <!-- 여행지 섹션 -->
    <section class="relative">
      <div
        v-for="(place, index) in places"
        :key="place.id"
        :ref="
          (el) => {
            if (el) placeRefs[index] = el
          }
        "
        class="flex min-h-screen items-center perspective-1000"
        :class="index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
      >
        <!-- 텍스트 영역 -->
        <div
          class="w-1/2 p-12 space-y-6 transform-style-3d"
          :class="placeState[index] === 'enter' ? 'animate-rotateIn' : 'animate-rotateOut'"
        >
          <h2 class="text-7xl font-bold text-gray-800">{{ place.name }}</h2>
          <p class="text-xl text-gray-600">{{ place.description }}</p>
        </div>
        <!-- 이미지 영역 -->
        <div class="w-1/2 h-screen overflow-hidden transform-style-3d">
          <img
            :src="place.image"
            :alt="place.name"
            class="w-full h-full object-cover transition-all duration-1000 hover:scale-110"
            :class="placeState[index] === 'enter' ? 'animate-rotateIn' : 'animate-rotateOut'"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import LoginModal from '@/views/Account/Login.vue'
import SignUp from '@/views/Account/SignUp.vue'

export default defineComponent({
  components: {
    LoginModal,
    SignUp,
  },
  setup() {
    const isLoginModalOpen = ref(false)

    const openLoginModal = () => {
      isLoginModalOpen.value = true
    }

    const closeLoginModal = () => {
      isLoginModalOpen.value = false
    }

    const isSignUpModalOpen = ref(false)

    const openSignUpModal = () => {
      isSignUpModalOpen.value = true
    }

    const closeSignUpModal = () => {
      isSignUpModalOpen.value = false
    }

    const texts = ['자연과 함께하는 여행', '새로운 경험을 찾아서', '당신만의 특별한 순간']
    const textState = ref<string[]>(new Array(texts.length).fill('exit')) // 'enter' 또는 'exit'
    const placeState = ref<string[]>([]) // 'enter' 또는 'exit'

    const textVisible = ref(new Array(texts.length).fill(false))
    const isVisible = ref<boolean[]>([])
    const placeRefs = ref<HTMLElement[]>([])
    const places = [
      {
        id: 1,
        name: '서울',
        description: '서울의 관광지입니다.',
        image: 'https://i.pinimg.com/control2/736x/e8/92/e9/e892e93044b21e5cc07166caf55fc989.jpg',
      },
      {
        id: 2,
        name: '대전',
        description: '대전의 관광지입니다.',
        image: 'https://i.pinimg.com/control2/236x/84/0d/b9/840db92cb8d433bf1cde508636b2b91a.jpg',
      },
      {
        id: 3,
        name: '구미',
        description: '구미의 관광지입니다.',
        image: 'https://i.pinimg.com/474x/f8/85/fc/f885fc7c49918308f17dce58198d53b7.jpg',
      },
      {
        id: 4,
        name: '광주',
        description: '광주의 관광지입니다.',
        image: 'https://i.pinimg.com/control2/236x/9f/32/df/9f32df6b4b9c472b2950915bf0fa7553.jpg',
      },
      {
        id: 5,
        name: '부산',
        description: '부산의 관광지입니다.',
        image: 'https://i.pinimg.com/control2/474x/9e/e6/6e/9ee66ebf6b34ff4438bf4609828d2052.jpg',
      },
      {
        id: 6,
        name: '제주도',
        description: '제주의 관광지입니다.',
        image: 'https://i.pinimg.com/control2/236x/39/ca/3c/39ca3c6d428afcde8d319d810874d774.jpg',
      },
    ]

    // Intersection Observer 설정
    // Intersection Observer 설정
    onMounted(() => {
      isVisible.value = new Array(places.length).fill(false)

      // 텍스트 섹션 관찰자
      const textObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = Math.floor(entry.target.getBoundingClientRect().top / window.innerHeight)
            if (entry.isIntersecting) {
              textVisible.value[index] = true // 보일 때 애니메이션 실행
            } else {
              textVisible.value[index] = false // 벗어나면 초기화
            }
          })
        },
        {
          threshold: 0.5,
          rootMargin: '0px', // 뷰포트를 기준으로 관찰
        },
      )

      // 여행지 섹션 관찰자
      const placesObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = placeRefs.value.findIndex((ref) => ref === entry.target)
            if (entry.isIntersecting) {
              placeState.value[index] = 'enter' // 뷰포트에 들어오면
            } else {
              placeState.value[index] = 'exit' // 뷰포트를 벗어나면
            }
          })
        },
        { threshold: 0.1 },
      )

      // 텍스트 섹션 관찰 시작
      document.querySelectorAll('.h-screen').forEach((el) => {
        textObserver.observe(el)
      })

      // 여행지 섹션 관찰 시작
      placeRefs.value.forEach((ref) => {
        if (ref) placesObserver.observe(ref)
      })
    })

    return {
      //nav바
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      isSignUpModalOpen,
      openSignUpModal,
      closeSignUpModal,

      texts,
      textVisible,
      textState,
      places,
      isVisible,
      placeState,
      placeRefs,
    }
  },
})
</script>

<style>
/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡnav바ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes buttonPress {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.95);
  }
}

/* 헤더 슬라이드 효과 */
header {
  animation: fadeIn 0.6s ease-in-out;
}

/* 버튼 클릭 효과 */
button:active {
  animation: buttonPress 0.1s ease-in-out;
  transform: scale(0.95); /* 클릭 시 즉각 반응 추가 */
}
/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡnav바ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ */

/* 추가: 애니메이션 재초기화 시 깜빡임 방지 */
.opacity-0 {
  opacity: 0 !important;
}

/* 3D 회전 효과를 위한 추가 스타일 */
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

@keyframes rotate3D {
  from {
    opacity: 0;
    transform: rotateY(-40deg) translateZ(-300px);
  }
  to {
    opacity: 1;
    transform: rotateY(0) translateZ(0);
  }
}

.animate-rotate3D {
  animation: rotate3D 1.2s ease-out forwards;
}

/* 텍스트 애니메이션 */
@keyframes textSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50px) rotateX(-20deg);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotateX(0);
  }
}

@keyframes textSlideOut {
  from {
    opacity: 1;
    transform: translateX(0) rotateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(50px) rotateX(20deg);
  }
}

.animate-textSlideIn {
  animation: textSlideIn 1s ease-out forwards;
}

.animate-textSlideOut {
  animation: textSlideOut 1s ease-in forwards;
}

/* 여행지 애니메이션 */
@keyframes rotateIn {
  from {
    opacity: 0;
    transform: rotateY(-40deg) translateZ(-300px);
  }
  to {
    opacity: 1;
    transform: rotateY(0) translateZ(0);
  }
}

@keyframes rotateOut {
  from {
    opacity: 1;
    transform: rotateY(0) translateZ(0);
  }
  to {
    opacity: 0;
    transform: rotateY(40deg) translateZ(-300px);
  }
}

.animate-rotateIn {
  animation: rotateIn 1.2s ease-out forwards;
}

.animate-rotateOut {
  animation: rotateOut 1.2s ease-in forwards;
}

/* 스크롤 스냅 효과 */
html {
  scroll-behavior: smooth;
}
</style>
