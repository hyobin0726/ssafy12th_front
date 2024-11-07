<template>
  <div class="w-full space-y-3">
    <div v-for="(comment, index) in comments" :key="index" class="pb-2">
      <p class="text-sm font-semibold">{{ comment.username }}</p>
      <p class="text-sm text-gray-700">{{ comment.content }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'ReviewComment',

  setup() {
    const comments = ref([
      { username: 'junsu1', content: '정말 멋진 리뷰네요!' },
      { username: 'junsu2', content: '사진도 예쁘고 잘 봤습니다.' },
      { username: 'junsu3', content: '다음에도 이런 리뷰 기대할게요.' },
    ])
    return { comments }
  },
})
</script>

<style lang="scss" scoped></style>
