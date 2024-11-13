<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-5 rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <Back @click="closeModal" class="w-6 h-6" />
        <span class="text-xl">리뷰 수정하기</span>
        <button class="text-xl" @click="updateReview">수정 완료</button>
      </div>
      <!-- 나머지 컴포넌트는 그대로 유지 -->
      <!-- 기존 작성 페이지와 동일한 내용 -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import Back from '@/assets/Nav/Back.svg'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import FullStar from '@/assets/Review/FullStar.svg'
import EmptyStar from '@/assets/Review/EmptyStar.svg'

export default defineComponent({
  name: 'EditReview',
  components: {
    Back,
    Swiper,
    SwiperSlide,
    FullStar,
    EmptyStar,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    reviewData: {
      type: Object,
      required: true,
    },
  },
  emits: ['close', 'submitImages'],

  setup(props, { emit }) {
    const previews = ref<string[]>(props.reviewData.imageUrls || [])
    const uploadedUrls = ref<string[]>(props.reviewData.imageUrls || [])

    const form = ref({
      content: props.reviewData.content || '',
      hashTags: props.reviewData.hashTags || [],
      location: props.reviewData.location || '',
      visibility: props.reviewData.visibility || 'public',
      rating: props.reviewData.rating || 0,
    })

    const formErrors = ref({
      rating: '',
      image: '',
    })

    // 나머지 함수와 로직은 그대로 유지하면서, 수정 API 요청만 추가
    const updateReview = async () => {
      if (!validateForm()) return

      const reviewData = {
        imageUrls: uploadedUrls.value,
        point: form.value.rating,
        content: form.value.content,
        visibility: form.value.visibility === 'public' ? 1 : 0,
      }

      const token = sessionStorage.getItem('accessToken')
      if (!token) {
        console.error('토큰이 없습니다. 로그인 후 다시 시도하세요.')
        return
      }
      try {
        await axios.put(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/update/${props.reviewData.id}`,
          reviewData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )
        console.log('리뷰가 성공적으로 수정되었습니다.')
        closeModal()
        location.reload()
      } catch (error) {
        console.error('리뷰 수정 실패:', error)
      }
    }

    const closeModal = () => {
      emit('close')
    }

    return {
      closeModal,
      previews,
      updateReview,
      uploadedUrls,
      form,
      formErrors,
    }
  },
})
</script>
