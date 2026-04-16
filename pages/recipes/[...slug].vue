<script setup lang="ts">
const route = useRoute()

const raw = route.params.slug
const parts = Array.isArray(raw)
  ? raw.map(segment => String(segment || '')).filter(Boolean)
  : [String(raw || '')].filter(Boolean)

if(!parts.length) {
  throw createError({ statusCode: 404, statusMessage: 'Recipe not found' })
}

const target = `/recipes/${parts[parts.length - 1]}/`
await navigateTo(target, { redirectCode: 308 })
</script>

<template>
  <div></div>
</template>
