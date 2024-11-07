<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-5 rounded-lg shadow-lg w-1/2 h-3/4 flex flex-col">
      <div class="header">
        <h2>새 게시글 작성</h2>
        <button class="upload-btn">업로드</button>
      </div>
      <div class="content">
        <div class="image-section">
          <img v-for="(url, index) in imageUrls" :src="url" :key="index" alt="게시물 사진" class="image-preview" />
        </div>
        <div class="form-section">
          <input type="text" placeholder="내용" v-model="form.content" class="input-field" />
          <input type="text" placeholder="해시태그" v-model="form.hashtag" class="input-field" />
          <input type="text" placeholder="위치 추가" v-model="form.location" class="input-field" />
          <select v-model="form.visibility" class="input-field">
            <option value="public">공개범위</option>
            <option value="private">비공개</option>
          </select>
          <div class="star-rating">
            <span v-for="n in 5" :key="n" class="star" @click="setRating(n)"> ★ </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ReviewWriteContent',
  props: {
    isOpen: { type: Boolean, required: true },
    imageUrls: { type: Array as () => string[], required: true },
  },
  setup() {
    const form = ref({
      content: '',
      hashtag: '',
      location: '',
      visibility: 'public',
      rating: 0,
    })

    const setRating = (value: number) => {
      form.value.rating = value
    }

    // const uploadPost = () => {
    //   console.log('포스트 업로드:', form.value, imageUrls)
    // }

    return {
      form,
      setRating,
    }
  },
})
</script>
