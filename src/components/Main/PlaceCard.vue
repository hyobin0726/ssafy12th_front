<template>
  <div
    class="card bg-white rounded-xl shadow-lg overflow-hidden w-3/4 sm:w-1/2 lg:w-1/3 transform transition-transform duration-700 opacity-0 translate-y-20"
    :style="{ animationDelay: `${index * 0.2}s` }"
  >
    <img :src="place.image" alt="place image" class="w-full h-40 object-cover" />
    <div class="p-4">
      <h3 class="text-xl font-bold text-gray-800">{{ place.name }}</h3>
      <p class="text-gray-600 mt-2">{{ place.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    place: {
      type: Object as PropType<{ name: string; description: string; image: string }>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
})
</script>

<style scoped>
.card {
  animation: fadeInUp 1s forwards ease-in-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
