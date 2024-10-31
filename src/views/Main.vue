<template>
  <div>
    <h1 class="bg-blue-500 text-white p-4">Main Page tailwind 적용</h1>
    <router-link to="/test">라우터 클릭</router-link>
    <br />
    <router-link to="/Login">로그인</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Main',
})
</script>
