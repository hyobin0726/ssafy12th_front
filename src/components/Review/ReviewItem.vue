<template>
  <div class="">
    <section class="p-5 flex flex-col items-center border-[1px] item bg-white">
      <div class="flex items-center w-full mb-4 justify-between">
        <div class="flex">
          <img :src="profileImageUrl" alt="Profile" class="w-12 h-12 rounded-full mr-2" />
          <div class="flex flex-col">
            <span class="font-bold">{{ profile?.loginId }}</span>
            <p>{{ formattedDate }}</p>
          </div>
        </div>
        <More class="w-8 h-8" @click="isOpen = true" v-if="myUserId === review.userId" />
      </div>

      <div class="p-2 flex justify-center mb-4 w-full" @click="isModalOpen = true">
        <ReviewImage :imageUrls="review.imageUrls" />
      </div>

      <div class="w-full flex mb-4 justify-between items-center">
        <ReviewLikeAndComment :review="review" />
      </div>
      <div class="w-full" @click="isModalOpen = true">
        <ReviewContents :review="review" />
      </div>
    </section>
    <ReviewDetail :review="review" :isVisible="isModalOpen" @close="isModalOpen = false" />
    <ReviewModal :isVisible="isOpen" @close="isOpen = false" :review="review" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { Review } from '@/types/Review'
import type { Member } from '@/types/Member'
import ReviewImage from '@/components/Review/ReviewImage.vue'
import ReviewLikeAndComment from './ReviewLikeAndComment.vue'
import ReviewContents from './ReviewContents.vue'
import ReviewDetail from './ReviewDetail.vue'
import More from '@/assets/Review/More.svg'
import ReviewModal from '@/components/Review/ReviewModal.vue'
import axios from 'axios'
import ProfileImage from '@/assets/Profile.png'

export default defineComponent({
  components: { ReviewImage, ReviewLikeAndComment, ReviewContents, ReviewDetail, More, ReviewModal },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
  },
  setup(props) {
    const token = sessionStorage.getItem('accessToken')
    const isModalOpen = ref(false)
    const isOpen = ref(false)
    const myUserId = ref('')
    const fetchMyLoginId = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/member`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        myUserId.value = response.data.userId
        // console.log('내 로그인 아이디:', myUserId.value)
      } catch (error) {
        console.error('내 로그인 아이디를 가져오는데 실패했습니다:', error)
      }
    }
    const formattedDate = computed(() => {
      const date = new Date(props.review.createdAt)
      return (
        date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) +
        ' ' +
        date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    })
    const profile = ref<Member>()
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/member/${props.review.userId}`)
        profile.value = response.data
        // console.log('프로필 데이터를 가져왔습니다:', profile.value)
      } catch (error) {
        console.error('리뷰 데이터를 가져오는데 실패했습니다:', error)
      }
    }
    onMounted(() => {
      fetchMyLoginId()
      fetchProfile()
    })
    const profileImageUrl = computed(() => {
      return profile.value?.profileUrl || ProfileImage
    })
    return { isModalOpen, isOpen, formattedDate, profile, fetchProfile, profileImageUrl, token, myUserId }
  },
})
</script>

<style scoped>
.item {
  box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  transform-origin: center center;
  cursor: pointer;
  counter-increment: item-counter;
}

.item:hover {
  transform: scale(1.1);
}
</style>
