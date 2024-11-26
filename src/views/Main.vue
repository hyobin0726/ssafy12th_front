<template>
  <div class="relative min-h-screen overflow-hidden">
    <section class="relative h-screen">
      <NavBar />
      <video autoplay muted loop class="w-full h-screen object-cover sticky top-0">
        <source src="@/assets/MainView.mp4" type="video/mp4" />
      </video>
      <div class="absolute inset-0 flex items-center justify-center bg-black/30">
        <h1 class="text-white text-[110px] font-[MaruBuriExtraLight] animate-textSlideIn">당신과 나를 기록하다.</h1>
      </div>
    </section>
    <!-- 여행지 섹션 -->
    <section class="relative">
      <div
        v-for="(place, index) in places"
        :key="place.id"
        ref="placeRefs"
        class="flex min-h-screen items-center perspective-1000"
        :class="index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
      >
        <!-- 텍스트 영역 -->
        <div
          class="w-1/2 p-12 space-y-6 transform-style-3d flex justify-center items-center flex-col"
          :class="placeState[index] === 'enter' ? 'animate-rotateIn' : 'animate-rotateOut'"
        >
          <div class="w-[60%] h-[80%]">
            <h2 class="text-7xl font-bold text-gray-800 mb-5">{{ place.name }}</h2>
            <p class="text-xl text-gray-600">{{ place.description }}</p>
          </div>
        </div>
        <!-- 이미지 영역 -->
        <div class="w-1/2 h-screen overflow-hidden transform-style-3d flex justify-center items-center">
          <img
            :src="place.image"
            :alt="place.name"
            class="object-cover transition-all duration-1000 hover:scale-110 w-[70%] h-[70%] rounded-lg"
            :class="placeState[index] === 'enter' ? 'animate-rotateIn' : 'animate-rotateOut'"
          />
        </div>
      </div>
    </section>
  </div>
  <Chatbot />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Chatbot from '@/components/Chatbot/Chatbot.vue'
import NavBar from '@/components/common/Nav.vue'

export default defineComponent({
  name: 'Main',
  components: {
    Chatbot,
    NavBar,
  },
  setup() {
    const places = [
      {
        id: 1,
        name: '서울',
        description:
          '서울의 경복궁은 조선 왕조의 첫 번째 궁궐로, 한국 전통 건축미와 역사를 대표하는 곳입니다. 1395년에 지어진 경복궁은 조선 왕조의 정치적 중심지였으며, 경회루와 근정전 같은 아름다운 건축물이 자리 잡고 있습니다. 고즈넉한 궁궐의 분위기 속에서 왕실의 삶을 상상해볼 수 있고, 한국의 전통문화 체험과 사진 촬영 명소로도 인기입니다. 특히, 한복을 입고 방문하면 더욱 특별한 추억을 만들 수 있습니다.',
        image: 'https://i.pinimg.com/736x/ea/bf/ea/eabfea7e93cae63cca706140ce988095.jpg',
      },
      {
        id: 2,
        name: '대전',
        description:
          '대전의 성심당은 1956년에 설립된 전통 깊은 베이커리로, "튀김소보로"와 "부추빵" 같은 독창적인 메뉴로 전국적인 명성을 얻고 있습니다. 대전을 방문하는 사람이라면 꼭 들러야 하는 필수 코스로, 긴 줄을 기다려도 후회 없는 맛을 자랑합니다. 성심당은 단순한 빵집을 넘어 대전 시민들의 자부심이자 상징이 되었으며, 베이커리 내부는 클래식한 분위기와 다양한 메뉴들로 가득 차 있어 방문객들의 만족도를 높입니다.',
        image: 'https://i.pinimg.com/736x/6c/54/6d/6c546db878a99693ffe9473a1163629a.jpg',
      },
      {
        id: 3,
        name: '구미',
        description:
          '구미의 금오산은 경북 지역을 대표하는 명산으로, 다양한 등산로와 금오산 호수가 어우러져 자연 속에서 힐링할 수 있는 장소입니다. 금오산 도립공원은 사계절 내내 방문객들로 붐비며, 특히 가을 단풍과 봄 벚꽃은 금오산의 매력을 한층 더 돋보이게 만듭니다. 정상에 위치한 대혜폭포와 금오산성 유적은 자연의 아름다움과 역사를 동시에 느낄 수 있는 명소로, 가족과 연인들의 소풍 장소로도 사랑받고 있습니다.',
        image:
          'https://mblogthumb-phinf.pstatic.net/MjAyMzEwMTVfMjQ1/MDAxNjk3MzgxODgyMjI5.pGMrFTis8ZrEMAq0xEj6BQp3aSUIleygomVG9mbL6aYg.mg5bfRuNe0h-7XSPHJG2CyY1eR1W3VozGk-NAmsBfKAg.JPEG.hjk7262/SE-89602eb1-1a32-422e-902f-99557dc05660.jpg?type=w800',
      },
      {
        id: 4,
        name: '부산',
        description:
          '부산의 광안리는 한국을 대표하는 해변 중 하나로, 고운 모래사장과 광안대교의 화려한 야경으로 유명합니다. 해변에서 해양 스포츠와 산책을 즐길 수 있으며, 근처에 위치한 다양한 카페와 레스토랑은 방문객들에게 최고의 휴식을 제공합니다. 밤이 되면 광안대교가 환하게 빛나는 모습은 낭만적인 분위기를 더하며, 매년 여름에는 부산 불꽃축제가 열려 광안리를 환상적인 축제의 장으로 만들어줍니다.',
        image: 'https://i.pinimg.com/736x/60/96/4f/60964f4a721f3349ce553ee6810aa700.jpg',
      },
      {
        id: 5,
        name: '제주도',
        description:
          '제주도의 성산일출봉은 유네스코 세계자연유산으로 지정된 독특한 화산지형으로, 화산 폭발로 형성된 거대한 분화구와 일출로 유명합니다. 해발 180m의 정상에서 바라보는 일출은 장엄한 풍경을 자랑하며, 제주도의 자연의 아름다움을 한눈에 감상할 수 있는 최고의 장소입니다. 등산로는 비교적 완만하여 누구나 쉽게 오를 수 있으며, 성산일출봉 주변에는 다양한 전통 음식점과 관광 명소가 있어 여행객들에게 풍부한 즐길 거리를 제공합니다.',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/%EC%84%B1%EC%82%B0%EC%9D%BC%EC%B6%9C%EB%B4%89_%EC%B2%9C%EC%97%B0%EB%B3%B4%ED%98%B8%EA%B5%AC%EC%97%AD_2019%EB%85%84_%EC%B4%AC%EC%98%81%28%EC%B6%9C%EC%B2%98_%EB%AC%B8%ED%99%94%EC%9E%AC%EC%B2%AD_%EB%8C%80%EB%B3%80%EC%9D%B8%EC%8B%A4%29.jpg/1200px-%EC%84%B1%EC%82%B0%EC%9D%BC%EC%B6%9C%EB%B4%89_%EC%B2%9C%EC%97%B0%EB%B3%B4%ED%98%B8%EA%B5%AC%EC%97%AD_2019%EB%85%84_%EC%B4%AC%EC%98%81%28%EC%B6%9C%EC%B2%98_%EB%AC%B8%ED%99%94%EC%9E%AC%EC%B2%AD_%EB%8C%80%EB%B3%80%EC%9D%B8%EC%8B%A4%29.jpg',
      },
    ]

    const placeState = ref<string[]>([])
    const placeRefs = ref<(HTMLElement | null)[]>([])
    onMounted(() => {
      // 여행지 섹션 관찰자
      const placesObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = placeRefs.value.findIndex((ref) => ref === entry.target)
            if (index !== -1) {
              placeState.value[index] = entry.isIntersecting ? 'enter' : 'exit'
            }
          })
        },
        { threshold: 0.1 },
      )

      // 여행지 섹션 관찰 시작
      placeRefs.value.forEach((ref) => {
        if (ref) placesObserver.observe(ref)
      })
    })
    return {
      places,
      placeState,
      placeRefs,
    }
  },
})
</script>

<style scoped>
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

.animate-textSlideIn {
  animation: textSlideIn 1s ease-out forwards;
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
