<template>
  <div class="flex items-center">
    <img :src="profile?.profileUrl || '/default-profile.png'" alt="Profile" class="w-12 h-12 rounded-full mr-2" />
    <div>
      <p class="text-sm font-semibold">{{ profile?.loginId || 'Unknown User' }}</p>
      <p class="text-sm text-gray-700">{{ comment.content }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import type { PropType } from 'vue'
import type { Comment } from '@/types/Comment'
import type { Member } from '@/types/Member'

export default defineComponent({
  props: {
    comment: {
      type: Object as PropType<Comment>,
      required: true,
    },
  },
  setup(props) {
    const profile = ref<Member | null>(null)
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/member/${props.comment.userId}`)
        profile.value = response.data
        // console.log('프로필 데이터를 가져왔습니다:', profile.value)
      } catch (error) {
        console.error('프로필 데이터를 가져오는데 실패했습니다:', error)
      }
    }
    onMounted(() => {
      fetchProfile()
    })
    return {
      profile,
    }
  },
})
</script>
