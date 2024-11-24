<template>
  <div class="h-screen flex justify-center items-center bg-blue-100">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">아직 참여한 모임이 없습니다.</h1>
      <p class="text-gray-600 mb-6">새로운 모임을 생성하거나 다른 모임에 참여해 보세요!</p>
      <button
        @click="openCreateModal"
        class="bg-green-500 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-300"
      >
        모임 생성하기
      </button>
    </div>

    <!-- CrewNewCreate 모달 -->
    <CrewNewCreate v-if="isModalOpen" @close="closeModal" @fetchMyCrews="onCrewCreated" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CrewNewCreate from '@/components/Crew/CrewNewCreate.vue'

export default defineComponent({
  components: {
    CrewNewCreate,
  },
  emits: ['crewCreated'], // 부모 컴포넌트에 이벤트 전달
  props: {
    onCreated: {
      type: Function,
      required: true,
    },
  },
  setup(_, { emit }) {
    const isModalOpen = ref(false)

    const openCreateModal = () => {
      isModalOpen.value = true // 모달 열기
    }

    const closeModal = () => {
      isModalOpen.value = false // 모달 닫기
    }

    const onCrewCreated = () => {
      closeModal() // 모달 닫기
      emit('crewCreated') // 부모에게 생성 완료 알림
    }

    return { isModalOpen, openCreateModal, closeModal, onCrewCreated }
  },
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 1.5s ease-in forwards;
}

.animate-slideUp {
  animation: slideUp 1s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.animate-scaleIn {
  animation: scaleIn 0.5s ease-out forwards;
  opacity: 0;
  transform: scale(0.9);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
