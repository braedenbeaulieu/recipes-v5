<script setup lang="ts">
import { formatDuration } from '~/utils/formatDuration'

defineProps<{
  prepTime?: string
  cookTime?: string
  totalTime?: string
  servings?: string | number
  difficulty?: string
}>()
</script>

<template>
  <dl class="recipe-meta">
    <div v-if="prepTime" class="recipe-meta__item">
      <dt>Prep</dt>
      <dd>{{ formatDuration(prepTime) }}</dd>
    </div>
    <div v-if="cookTime" class="recipe-meta__item">
      <dt>Cook</dt>
      <dd>{{ formatDuration(cookTime) }}</dd>
    </div>
    <div v-if="totalTime" class="recipe-meta__item">
      <dt>Total</dt>
      <dd>{{ formatDuration(totalTime) }}</dd>
    </div>
    <div v-if="servings" class="recipe-meta__item">
      <dt>Servings</dt>
      <dd>{{ servings }}</dd>
    </div>
    <div v-if="difficulty" class="recipe-meta__item">
      <dt>Difficulty</dt>
      <dd>{{ difficulty }}</dd>
    </div>
  </dl>
</template>
