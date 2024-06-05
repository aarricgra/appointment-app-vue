<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="menu">
    <RouterLink to="/" class="menuElement">Home</RouterLink>
    <RouterLink to="/calendar" class="menuElement">Servicos</RouterLink>
  </div>
  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>

</style>
