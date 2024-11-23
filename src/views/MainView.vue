<template>
  <section class="h-full relative">
    <video autoplay muted loop class="w-full h-full object-cover">
      <source src="@/assets/MainView.mp4" type="video/mp4" />
    </video>
    <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <h1 class="text-white text-4xl font-bold">Welcome to the Tour</h1>
    </div>
    <section v-for="(place, index) in places" :key="place.id" class="flex items-center justify-center" ref="sections">
      <div
        class="card bg-gray-800 p-8 rounded-xl shadow-lg transform transition-transform duration-700 text-white"
        :class="{
          'animate-fade-in': activeSection === index,
          'opacity-0 translate-y-10': activeSection !== index,
        }"
      >
        <img :src="place.image" :alt="place.name" class="w-full h-40 object-cover rounded-lg mb-4" />
        <h2 class="text-2xl font-bold mb-2">{{ place.name }}</h2>
        <p class="text-gray-400">{{ place.description }}</p>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'

export default defineComponent({
  setup() {
    // 데이터와 상태 관리
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

    const activeSection = ref(0)
    const sections = ref<HTMLElement[]>([])
    let observer: IntersectionObserver | null = null

    // IntersectionObserver 설정
    const observeSections = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = sections.value.indexOf(entry.target as HTMLElement)
              if (index !== -1) {
                activeSection.value = index
              }
            }
          })
        },
        { threshold: 0.5 },
      )

      sections.value.forEach((section) => {
        observer?.observe(section)
      })
    }

    // Mount와 Unmount 시 호출
    onMounted(() => {
      sections.value = Array.from(document.querySelectorAll('section'))
      observeSections()
    })

    onBeforeUnmount(() => {
      if (observer) {
        observer.disconnect()
      }
    })

    return {
      places,
      activeSection,
      sections,
    }
  },
})
</script>

<style scoped>
/* 애니메이션 효과 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-in-out forwards;
}

/* 배경 애니메이션 효과 */
.bg-animation {
  background-image: url(https://cdn.pixabay.com/photo/2020/08/11/21/39/clouds-5481190_1280.jpg);
  background-size: 200% 200%;
  animation: bg-move 10s linear infinite; /* linear로 설정해 자연스러운 반복 */
}

@keyframes bg-move {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>
