<script setup lang="ts">
import type { RecipesCollectionItem } from '@nuxt/content'
import { useIngredientEnhancements } from '~/composables/useIngredientEnhancements'

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

const recipeContentRef = ref<HTMLElement | null>(null)
const { ingredientToast, ingredientToastPosition } = useIngredientEnhancements(recipeContentRef, computed(() => page.value?.path))
</script>

<template>
  <AppShell>
    <template #sidebar>
      <AppSidebar :items="recipeItems" :current-path="recipePage.path" />
    </template>
      <article class="recipe-page">
        <RecipePageHeader
          :recipe-page="recipePage"
          :category-slug="categorySlug"
          :content-root="recipeContentRef"
        />

        <div ref="recipeContentRef" class="recipe-content">
          <ContentRenderer :value="recipePage" class="prose recipe-prose" />
        </div>

        <IngredientToast :message="ingredientToast" :position="ingredientToastPosition" />
      </article>

    <template #toc>
      <AppToc :links="recipePage.body?.toc?.links" />
    </template>
  </AppShell>
</template>

<style scoped lang="scss">
.recipe-page {
  max-width: 860px;
}

:deep(main.content-area) {
  padding: 1.5rem clamp(0.75rem, 2.5vw, 2rem) 3rem;
}

@media (max-width: 1180px) {
  .recipe-page {
    max-width: none;
  }
}

@media (max-width: 860px) {
  :deep(main.content-area) {
    padding: 1.25rem 1rem 2.5rem;
  }
}

:deep(.recipe-prose) {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 4px);
  padding: clamp(1.25rem, 3vw, 2rem);
  box-shadow: var(--shadow);
}

:deep(.recipe-prose :where(h2, h3, h4)) {
  scroll-margin-top: 1.5rem;
}

:deep(.recipe-prose h2) {
  margin-top: 2.25rem;
  font-size: 1.55rem;
  color: var(--text);
  letter-spacing: -0.01em;
}

:deep(.recipe-prose h3) {
  margin-top: 1.5rem;
  font-size: 1.15rem;
  color: var(--text);
  letter-spacing: -0.01em;
}

:deep(.recipe-prose p),
:deep(.recipe-prose li) {
  color: var(--muted);
  line-height: 1.8;
}

:deep(.recipe-prose ul),
:deep(.recipe-prose ol) {
  padding-left: 1.2rem;
}

:deep(.recipe-prose code) {
  background: var(--code-bg);
  border-radius: 6px;
  padding: 0.15rem 0.4rem;
}

:deep(.recipe-prose > :first-child) {
  margin-top: 0;
}

:deep(.recipe-prose > :last-child) {
  margin-bottom: 0;
}

:deep(.ingredient-ref) {
  display: inline;
  font: inherit;
  font-weight: 600;
  color: var(--accent);
  background: var(--accent-fill);
  border: 1px solid var(--accent-border);
  border-radius: 10px;
  padding: 0.05em 0.35em;
  margin: 0;
  cursor: pointer;
}

:deep(.ingredient-ref:hover) {
  background: var(--accent-fill-hover);
}

:deep(.ingredient-ref:focus) {
  outline: none;
  box-shadow: 0 0 0 4px var(--accent-soft);
}

:deep(.ingredients-section strong) {
  font-weight: inherit;
}
</style>
