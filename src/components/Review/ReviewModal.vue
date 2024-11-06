<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-3 rounded-lg shadow-lg w-64 flex flex-col">
      <ul class="mt-2">
        <li class="p-2 text-center cursor-pointer hover:bg-gray-100 rounded-md" @click="editPost">게시글 수정</li>
        <li class="p-2 text-center cursor-pointer hover:bg-gray-100 rounded-md" @click="deletePost">게시글 삭제</li>
      </ul>
      <button
        @click="closeModal"
        class="mt-4 px-4 py-2 bg-[#DAB692] text-white rounded-md cursor-pointer hover:bg-[#E8C9AD]"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close') // 부모 컴포넌트에 모달 닫기 이벤트 전송
    },
    editPost() {
      console.log('게시글 수정') // 수정 로직 추가
      this.closeModal()
    },
    deletePost() {
      console.log('게시글 삭제') // 삭제 로직 추가
      this.closeModal()
    },
  },
})
</script>

<style scoped></style>
