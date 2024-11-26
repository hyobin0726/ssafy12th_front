<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50">
    <div class="bg-white p-3 rounded-lg shadow-lg w-64 flex flex-col">
      <ul class="mt-2">
        <li class="p-2 text-center cursor-pointer hover:bg-gray-100 rounded-md" @click="deletePost">삭제</li>
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
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import ReviewUpdate from './ReviewUpdate.vue'
import { useToast } from 'vue-toast-notification'
export default defineComponent({
  components: { ReviewUpdate },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    comment: {
      type: Object,
      required: true,
    },
  },

  emits: ['close', 'post-edit', 'post-delete'],
  setup(props) {
    const toast = useToast()
    const isReviewUpdate = ref(false)
    const isModalOpen = ref(false)
    const fetchDeleteReview = async () => {
      try {
        const token = sessionStorage.getItem('accessToken')
        if (!token) {
          toast.error('로그인 후 이용해주세요.')
          return
        }

        await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/comments/${props.comment.commentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        toast.success('댓글이 성공적으로 삭제되었습니다.')
        // console.log('댓글이 성공적으로 삭제되었습니다.')
      } catch (error) {
        console.error('댓글 삭제 실패:', error)
      }
    }
    return { fetchDeleteReview, isModalOpen, isReviewUpdate }
  },
  methods: {
    closeModal() {
      this.$emit('close') // 부모 컴포넌트에 모달 닫기 이벤트 전송
    },

    deletePost() {
      console.log('댓글 삭제')
      this.fetchDeleteReview().then(() => {
        this.$emit('post-delete') // 부모 컴포넌트로 삭제 이벤트 전송
        this.closeModal()
      })
      // this.closeModal()
      // location.reload()
    },
  },
})
</script>

<style scoped></style>
