<template>
  <div class="w-full space-y-3">
    <div v-for="(comment, index) in comments" :key="index" class="pb-2 flex items-center">
      <img :src="profileImageUrl" alt="Profile" class="w-12 h-12 rounded-full mr-2" />
      <div>
        <p class="text-sm font-semibold">{{ profile?.loginId }}</p>
        <p class="text-sm text-gray-700">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import axios from 'axios'
import type { PropType } from 'vue'
import ProfileImage from '@/assets/Profile.png'
import type { Member } from '@/types/Member'
import type { Review } from '@/types/Review'
export default defineComponent({
  name: 'ReviewComment',
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
  },
  setup() {
    const comments = ref([
      { username: 'junsu1', content: '정말 멋진 리뷰네요!' },
      { username: 'junsu2', content: '사진도 예쁘고 잘 봤습니다.' },
      { username: 'junsu3', content: '다음에도 이런 리뷰 기대할게요.' },
    ])
    const profile = ref<Member>()
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/member/${1}`)
        profile.value = response.data
        // console.log('프로필 데이터를 가져왔습니다:', profile.value)
      } catch (error) {
        console.error('프로필 데이터를 가져오는데 실패했습니다:', error)
      }
    }
    onMounted(() => {
      fetchProfile()
    })
    const profileImageUrl = computed(() => {
      return profile.value?.profileUrl || ProfileImage
    })
    return { comments, profileImageUrl, profile, fetchProfile }
  },
})
</script>

<style lang="scss" scoped></style>
