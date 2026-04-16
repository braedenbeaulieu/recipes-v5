<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => titleChunk ? `Recipes | ${titleChunk}` : 'Recipes'
})
</script>

<template>
  <NuxtPage />
</template>
