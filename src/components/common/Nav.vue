<template>
  <section class="flex flex-col p-5 h-screen space-y-4 bg-[#C49E7B] bg-opacity-30">
    <div>
      <router-link to="/"> <Logo class="h-28" /></router-link>
    </div>
    <ul class="flex flex-col space-y-0 overflow-y-auto ml-3">
      <router-link to="/">
        <li class="flex items-center space-x-3 mb-6 cursor-pointer hover:text-[#8C735B]">
          <Home class="h-7" />
          <span class="text-xl">Home</span>
        </li>
      </router-link>
      <router-link to="/">
        <li class="flex items-center space-x-3 mb-6 cursor-pointer hover:text-[#8C735B]">
          <Search class="h-7" />
          <span class="text-xl">Search</span>
        </li>
      </router-link>
      <router-link to="/">
        <li class="flex items-center space-x-3 mb-6 cursor-pointer hover:text-[#8C735B]">
          <Message class="h-7" />
          <span class="text-xl">Message</span>
        </li>
      </router-link>
      <div>
        <li class="flex items-center space-x-3 mb-6 cursor-pointer hover:text-[#8C735B]" @click="isModalOpen = true">
          <Write class="h-7" />
          <span class="text-xl">Create</span>
        </li>
      </div>
      <ReviewWrite :isVisible="isModalOpen" @close="isModalOpen = false" />
      <router-link to="/">
        <li class="flex items-center space-x-3 mb-6 cursor-pointer hover:text-[#8C735B]">
          <Profile class="w-7" />
          <span class="text-xl">Profile</span>
        </li>
      </router-link>
      <router-link to="/">
        <li class="flex items-center space-x-3 mb-6 cursor-pointer hover:text-[#8C735B]">
          <Settings class="h-7" />
          <span class="text-xl">Settings</span>
        </li>
      </router-link>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Logo from '@/assets/logo.svg'
import Home from '@/assets/Nav/home.svg'
import Search from '@/assets/Nav/search.svg'
import Message from '@/assets/Nav/message.svg'
import Write from '@/assets/Nav/Write.svg'
import Profile from '@/assets/Nav/Profile.svg'
import Settings from '@/assets/Nav/settings.svg'
import ReviewWrite from '../Review/ReviewWrite.vue'

export default defineComponent({
  components: {
    Logo,
    Home,
    Search,
    Message,
    Write,
    Profile,
    Settings,
    ReviewWrite,
  },
  setup() {
    const isModalOpen = ref(false)
    return { isModalOpen }
  },
})
</script>

<style lang="scss" scoped></style>
