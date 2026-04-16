<script setup lang="ts">
import type { RecipesCollectionItem } from '@nuxt/content'
import { formatCategory } from '~/utils/formatCategory'

useSeoMeta({
  title: 'Categories',
  description: 'Browse recipes by category.'
})

const toCategorySlug = (path: string) => {
  const parts = String(path || '').split('/').filter(Boolean)
  return parts[1] || 'uncategorized'
}

const toRecipeSlug = (path: string) => {
  const parts = String(path || '').split('/').filter(Boolean)
  return parts[parts.length - 1] || ''
}

const { data: recipes } = await useAsyncData<RecipesCollectionItem[]>('recipes-categories', () =>
  (queryCollection as any)('recipes')
    .where('published', '=', true)
    .order('path', 'ASC')
    .all()
)

const recipeItems = computed(() =>
  (recipes.value || []).map((recipe: RecipesCollectionItem) => {
    const slug = toRecipeSlug(recipe.path)

    return {
      title: recipe.title,
      path: `/recipes/${slug}/`,
      category: toCategorySlug(recipe.path)
    }
  })
)

type CategoryInfo = {
  slug: string
  label: string
  count: number
}

const categories = computed<CategoryInfo[]>(() => {
  const map = new Map<string, CategoryInfo>()

  for(const recipe of recipes.value || []) {
    const slug = toCategorySlug(recipe.path)
    if(!slug) {
      continue
    }

    const existing = map.get(slug)
    if(existing) {
      existing.count += 1
    } else {
      map.set(slug, { slug, label: formatCategory(slug), count: 1 })
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if(b.count !== a.count) {
      return b.count - a.count
    }

    return a.label.localeCompare(b.label)
  })
})
</script>

<template>
  <AppShell>
    <template #sidebar>
      <AppSidebar :items="recipeItems" />
    </template>

    <header class="page-header">
      <h1>Categories</h1>
      <p>Browse recipes by category.</p>
    </header>

    <ul class="category-grid" aria-label="Category list">
      <li v-for="category in categories" :key="category.slug" class="category-grid__item">
        <NuxtLink class="category-chip" :to="`/category/${category.slug}/`">
          <span class="category-chip__label">{{ category.label }}</span>
          <span class="category-chip__count" aria-label="Recipe count">{{ category.count }}</span>
        </NuxtLink>
      </li>
    </ul>

    <p v-if="!categories.length" class="empty">No categories found.</p>
  </AppShell>
</template>

<style scoped lang="scss">
.page-header {
  margin-bottom: 1.5rem;
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

.category-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.category-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 0.9rem;
  border-radius: 14px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
}

.category-chip:hover {
  transform: translateY(-1px);
  border-color: var(--accent-border-soft);
  box-shadow: var(--shadow-lift);
}

.category-chip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--accent-soft), var(--shadow-lift);
}

.category-chip__label {
  color: var(--text);
  font-weight: 600;
}

.category-chip__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2rem;
  padding: 0 0.55rem;
  border-radius: 999px;
  background: var(--surface-subtle);
  border: 1px solid var(--surface-subtle-border);
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.empty {
  margin-top: 1rem;
  color: var(--muted);
}
</style>
