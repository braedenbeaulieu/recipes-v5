<script setup lang="ts">
import type { RecipesCollectionItem } from '@nuxt/content'
import { formatCategory } from '~/utils/formatCategory'
import { formatDuration } from '~/utils/formatDuration'

const route = useRoute()
const tagSlug = computed(() => String(route.params.tag || ''))

const slugifyTag = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const { data: recipes } = await useAsyncData<RecipesCollectionItem[]>('recipes-tags-archive', () =>
  (queryCollection as any)('recipes')
    .where('published', '=', true)
    .order('path', 'ASC')
    .all()
)

const toRecipeRoute = (path: string) => {
  const parts = String(path || '').split('/').filter(Boolean)
  const slug = parts[parts.length - 1] || ''
  return `/recipes/${slug}/`
}

const recipeItems = computed(() =>
  (recipes.value || []).map((recipe: RecipesCollectionItem) => ({
    title: recipe.title,
    path: toRecipeRoute(recipe.path),
    category: recipe.path.split('/')[2] || 'uncategorized'
  }))
)

const matchingRecipes = computed(() => {
  const wanted = tagSlug.value
  if(!wanted) {
    return [] as RecipesCollectionItem[]
  }

  return (recipes.value || []).filter((recipe) => {
    const list = (recipe as any).tags as string[] | undefined
    if(!Array.isArray(list)) {
      return false
    }

    return list.some((tag) => slugifyTag(String(tag || '')) === wanted)
  })
})

const tagLabel = computed(() => {
  const wanted = tagSlug.value

  for(const recipe of recipes.value || []) {
    const list = (recipe as any).tags as string[] | undefined
    if(!Array.isArray(list)) {
      continue
    }

    for(const raw of list) {
      const label = String(raw || '').trim()
      if(!label) {
        continue
      }

      if(slugifyTag(label) === wanted) {
        return label
      }
    }
  }

  return wanted
})

useSeoMeta({
  title: computed(() => `Tag: ${tagLabel.value}`),
  description: computed(() => `Recipes tagged ${tagLabel.value}.`)
})
</script>

<template>
  <AppShell>
    <template #sidebar>
      <AppSidebar :items="recipeItems" />
    </template>

    <header class="page-header">
      <p class="page-header__eyebrow">
        <NuxtLink to="/tags/">Tags</NuxtLink>
      </p>
      <h1>{{ tagLabel }}</h1>
      <p>{{ matchingRecipes.length }} recipe{{ matchingRecipes.length === 1 ? '' : 's' }}</p>
    </header>

    <div v-if="!matchingRecipes.length" class="empty">
      No recipes found for this tag.
    </div>

    <div v-else class="recipe-grid">
      <NuxtLink
        v-for="recipe in matchingRecipes"
        :key="recipe.path"
        :to="toRecipeRoute(recipe.path)"
        class="recipe-card"
      >
        <div class="recipe-card__header">
          <h2 class="recipe-card__title">{{ recipe.title }}</h2>
          <p class="recipe-card__category">{{ formatCategory(recipe.path.split('/')[2] || 'uncategorized') }}</p>
        </div>

        <p v-if="(recipe as any).description" class="recipe-card__description">{{ (recipe as any).description }}</p>

        <dl class="recipe-card__meta" aria-label="Recipe details">
          <div v-if="(recipe as any).prepTime">
            <dt>Prep</dt>
            <dd>{{ formatDuration((recipe as any).prepTime) }}</dd>
          </div>
          <div v-if="(recipe as any).totalTime">
            <dt>Total</dt>
            <dd>{{ formatDuration((recipe as any).totalTime) }}</dd>
          </div>
          <div v-if="(recipe as any).servings">
            <dt>Servings</dt>
            <dd>{{ (recipe as any).servings }}</dd>
          </div>
        </dl>
      </NuxtLink>
    </div>
  </AppShell>
</template>

<style scoped lang="scss">
.page-header {
  margin-bottom: 1.5rem;
}

.page-header__eyebrow {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: var(--text);
}

.page-header h1 {
  margin: 0.35rem 0 0.5rem;
  font-size: clamp(2rem, 4vw, 3rem);
}

.page-header p {
  max-width: 62ch;
  color: var(--muted);
  line-height: 1.6;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.recipe-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.1rem 1.15rem;
  box-shadow: var(--shadow-soft);
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
  text-decoration: none;
  container-type: inline-size;
}

.recipe-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-border-soft);
  box-shadow: var(--shadow-lift);
}

.recipe-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--accent-soft), var(--shadow-lift);
}

.recipe-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.85rem;
}

.recipe-card__title {
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.25;
  letter-spacing: -0.01em;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-card__category {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
  white-space: nowrap;
}

@container (max-width: 520px) {
  .recipe-card__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .recipe-card__category {
    white-space: normal;
  }
}

.recipe-card__description {
  color: var(--muted);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
}

.recipe-card__meta div {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface-subtle);
  border: 1px solid var(--surface-subtle-border);
  border-radius: 12px;
  padding: 0.4rem 0.65rem;
}

.recipe-card__meta dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.recipe-card__meta dd {
  margin: 0;
  font-weight: 600;
  color: var(--text);
}

.empty {
  color: var(--muted);
}
</style>
