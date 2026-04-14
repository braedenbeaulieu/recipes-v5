<script setup lang="ts">
import type { RecipesCollectionItem } from '@nuxt/content'

const route = useRoute()
const path = computed(() => `/recipes/${(route.params.slug as string[]).join('/')}`)

const { data: page } = await useAsyncData<RecipesCollectionItem | null>(`recipe:${path.value}`, () =>
  (queryCollection as any)('recipes').path(path.value).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Recipe not found' })
}

const recipePage = computed(() => page.value!)

useSeoMeta({
  title: recipePage.value.title,
  description: recipePage.value.description || `Recipe for ${recipePage.value.title}`
})

const categorySlug = computed(() => recipePage.value.path.split('/')[2] || 'uncategorized')

const { data: recipes } = await useAsyncData<RecipesCollectionItem[]>('recipes-sidebar', () =>
  (queryCollection as any)('recipes')
    .where('published', '=', true)
    .order('path', 'ASC')
    .all()
)

const recipeItems = computed(() =>
  (recipes.value || []).map((recipe: RecipesCollectionItem) => ({
    title: recipe.title,
    path: recipe.path,
    category: recipe.path.split('/')[2] || 'uncategorized'
  }))
)
</script>

<template>
  <div class="app-shell">
    <AppSidebar :items="recipeItems" :current-path="recipePage.path" />

    <main class="content-area">
      <article class="recipe-page">
        <header class="page-header page-header--recipe">
          <p class="page-header__eyebrow">
            <NuxtLink :to="`/recipes/${categorySlug}/`">{{ categorySlug }}</NuxtLink>
          </p>
          <h1>{{ recipePage.title }}</h1>
          <p v-if="recipePage.description">{{ recipePage.description }}</p>
          <p v-if="recipePage.tags?.length" class="recipe-tags">
            <span class="screen-reader-text">Tags</span>
            <span v-for="tag in recipePage.tags" :key="tag" class="tag">{{ tag }}</span>
          </p>

          <RecipeMeta
            :prep-time="recipePage.prepTime"
            :cook-time="recipePage.cookTime"
            :total-time="recipePage.totalTime"
            :servings="recipePage.servings"
            :difficulty="recipePage.difficulty"
          />

          <KeepAwakeToggle />
        </header>

        <ContentRenderer :value="recipePage" class="prose recipe-prose" />
      </article>
    </main>

    <AppToc :links="recipePage.body?.toc?.links" />
  </div>
</template>
