<template>
  <section class="flex items-center space-x-4">
    <div class="flex items-center space-x-2">
      <div
        @click="toggleLike"
        class="flex items-center cursor-pointer hover:scale-110 transition-transform duration-200"
      >
        <component
          :is="isLiked ? 'FullHeart' : 'NonHeart'"
          class="w-7 h-7"
          :class="{ 'animate-bounce-heart': isLiked }"
        />
      </div>
      <span class="text-xl">{{ likeCount }} 개</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="flex items-center cursor-pointer hover:scale-110 transition-transform duration-200">
        <Chat class="w-7 h-7" />
      </div>
      <!-- <span class="text-xl">{{ commentCount }} 개</span> -->
    </div>
  </section>
  <section @click="toggleBookmark" class="cursor-pointer hover:scale-110 transition-transform duration-200">
    <component :is="isBookmarked ? 'Bookmark' : 'NonBookmark'" class="w-7 h-7" />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import type { PropType } from 'vue'
import type { Review } from '@/types/Review'
import NonHeart from '@/assets/Review/NonHeart.svg'
import Bookmark from '@/assets/Review/Bookmark.svg'
import NonBookmark from '@/assets/Review/NonBookmark.svg'
import Chat from '@/assets/Review/Chat.svg'
import FullHeart from '@/assets/Review/FullHeart.svg'

export default defineComponent({
  components: { NonHeart, Chat, Bookmark, FullHeart, NonBookmark },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
  },
  setup(props) {
    const isLiked = ref(false)
    const isBookmarked = ref(false)
    //좋아요 상태
    const token = sessionStorage.getItem('accessToken')
    const fetchLikeStatus = async () => {
      if (!token) {
        console.log('토큰이 없습니다. 좋아요 상태를 조회할 수 없습니다.')
        return
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/love/${props.review.reviewId}/check`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        isLiked.value = response.data
        // console.log(isLiked.value)
      } catch (error) {
        console.error('좋아요 상태를 가져오는데 실패했습니다:', error)
      }
    }
    const toggleLike = () => {
      if (!token) {
        alert('로그인이 필요합니다.')
        return
      }
      try {
        if (isLiked.value) {
          axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/love/${props.review.reviewId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          isLiked.value = false
          likeCount.value--
        } else {
          axios.post(
            `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/love/${props.review.reviewId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          isLiked.value = true
          likeCount.value++
        }
      } catch (error) {
        console.error('좋아요 상태를 변경하는데 실패했습니다:', error)
      }
    }
    //북마크 상태
    const fetchBookmarkStatus = async () => {
      if (!token) {
        console.log('토큰이 없습니다. 북마크 상태를 조회할 수 없습니다.')
        return
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/bookmark/${props.review.reviewId}/check`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        isBookmarked.value = response.data
      } catch (error) {
        console.error('북마크 상태를 가져오는데 실패했습니다:', error)
      }
    }
    const toggleBookmark = () => {
      if (!token) {
        alert('로그인이 필요합니다.')
        return
      }
      try {
        if (isBookmarked.value) {
          axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/bookmark/${props.review.reviewId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          isBookmarked.value = false
        } else {
          axios.post(
            `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/bookmark/${props.review.reviewId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          isBookmarked.value = true
        }
      } catch (error) {
        console.error('북마크 상태를 변경하는데 실패했습니다:', error)
      }
    }
    // console.log(props.review, '??')
    const likeCount = ref(0)
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/love/${props.review.reviewId}`,
        )
        likeCount.value = response.data
      } catch (error) {
        console.error('좋아요 개수를 가져오는데 실패했습니다:', error)
      }
    }
    onMounted(() => {
      fetchLikeCount()
      fetchLikeStatus()
      fetchBookmarkStatus()
    })

    return {
      isLiked,
      toggleLike,
      isBookmarked,
      toggleBookmark,
      likeCount,
      fetchLikeCount,
      fetchLikeStatus,
      token,
      fetchBookmarkStatus,
    }
  },
})
</script>

<style scoped>
@keyframes bounce-heart {
  0% {
    transform: scale(1) translateY(0);
  }
  30% {
    transform: scale(1.2) translateY(-10px); /* 상단으로 튕기는 효과 */
  }
  50% {
    transform: scale(0.9) translateY(0); /* 축소되며 다시 원래 위치로 돌아옴 */
  }
  70% {
    transform: scale(1.1) translateY(-4px); /* 다시 조금 튕김 */
  }
  100% {
    transform: scale(1) translateY(0); /* 원래 크기와 위치로 돌아옴 */
  }
}

.animate-bounce-heart {
  animation: bounce-heart 0.6s ease-in-out; /* 0.6초 동안 애니메이션 */
}
</style>
