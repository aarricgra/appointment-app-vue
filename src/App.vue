<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="menu">
    <RouterLink to="/" class="menuElement">Home</RouterLink>
    <RouterLink to="/about" class="menuElement">About</RouterLink>
  </div>
  <div class="swap">
    <RouterView />
  </div>
</template>

<style scoped>

</style>
