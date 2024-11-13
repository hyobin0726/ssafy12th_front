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
import axios from 'axios'

export default defineComponent({
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    review: {
      type: Object,
      required: true,
    },
  },

  emits: ['close', 'post-edit', 'post-delete'],
  setup(props) {
    const fetchDeleteReview = async () => {
      try {
        const token = sessionStorage.getItem('accessToken')
        if (!token) {
          console.error('토큰이 없습니다. 로그인 후 다시 시도하세요.')
          return
        }

        await axios.delete(`http://localhost:8080/api/v1/reviews/remove/${props.review.reviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('게시글이 성공적으로 삭제되었습니다.')
      } catch (error) {
        console.error('게시글 삭제 실패:', error)
      }
    }
    return { fetchDeleteReview }
  },
  methods: {
    closeModal() {
      this.$emit('close') // 부모 컴포넌트에 모달 닫기 이벤트 전송
    },
    editPost() {
      console.log('게시글 수정')
      this.$emit('post-edit', this.review)
      this.closeModal()
    },
    deletePost() {
      console.log('게시글 삭제')
      this.fetchDeleteReview()
      this.closeModal()
      location.reload()
    },
  },
})
</script>

<style scoped></style>
