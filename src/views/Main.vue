<template>
  <div>
    <h1 class="bg-blue-500 text-white p-4">Main Page tailwind 적용</h1>
    <router-link to="/test">라우터 클릭</router-link>
    <br />
    <router-link to="/login">로그인</router-link>
    <br />
    <router-link to="/signUp">회원가입</router-link>
    <br />
    <router-link to="/reviewList">리뷰 목록 보기</router-link>
    <br />
    <router-link to="/MyPage">마이페이지</router-link>
    <br />
    <router-link to="/map">지도</router-link>
    <br />
    <router-link to="/search">검색</router-link>
    <br />
    <router-link to="/crewCreate">모임생성</router-link>
    <br />
    <router-link to="/crewPage">모임페이지</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Main',
})
</script>
