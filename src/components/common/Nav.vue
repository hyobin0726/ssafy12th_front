<template>
  <section class="flex flex-col p-5 h-screen space-y-4 bg-[#C49E7B] bg-opacity-30">
    <div>
      <Logo class="h-28" />
    </div>
    <ul class="flex flex-col space-y-6 overflow-y-auto ml-3">
      <router-link to="/">
        <li class="flex items-center space-x-3 cursor-pointer hover:text-[#8C735B]">
          <Home class="h-7" />
          <span class="text-xl">Home</span>
        </li>
      </router-link>
      <router-link to="/">
        <li class="flex items-center space-x-3 cursor-pointer hover:text-[#8C735B]">
          <Search class="h-7" />
          <span class="text-xl">Search</span>
        </li>
      </router-link>
      <router-link to="/">
        <li class="flex items-center space-x-3 cursor-pointer hover:text-[#8C735B]">
          <Message class="h-7" />
          <span class="text-xl">Message</span>
        </li>
      </router-link>
      <router-link to="/">
        <li class="flex items-center space-x-3 cursor-pointer hover:text-[#8C735B]">
          <Write class="h-7" />
          <span class="text-xl">Create</span>
        </li>
      </router-link>
      <router-link to="/">
        <li class="flex items-center space-x-3 cursor-pointer hover:text-[#8C735B]">
          <Profile class="w-7" />
          <span class="text-xl">Profile</span>
        </li>
      </router-link>
      <router-link to="/">
        <li class="flex items-center space-x-3 cursor-pointer hover:text-[#8C735B]">
          <Settings class="h-7" />
          <span class="text-xl">Settings</span>
        </li>
      </router-link>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Logo from '@/assets/logo.svg'
import Home from '@/assets/Nav/home.svg'
import Search from '@/assets/Nav/search.svg'
import Message from '@/assets/Nav/message.svg'
import Write from '@/assets/Nav/Write.svg'
import Profile from '@/assets/Nav/Profile.svg'
import Settings from '@/assets/Nav/settings.svg'

export default defineComponent({
  components: {
    Logo,
    Home,
    Search,
    Message,
    Write,
    Profile,
    Settings,
  },
})
</script>

<style lang="scss" scoped></style>
