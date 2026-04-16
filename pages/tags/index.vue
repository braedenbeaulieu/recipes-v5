<script setup lang="ts">
import type { RecipesCollectionItem } from '@nuxt/content'

useSeoMeta({
  title: 'Tags',
  description: 'Browse recipes by tag.'
})

const slugifyTag = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const { data: recipes } = await useAsyncData<RecipesCollectionItem[]>('recipes-tags', () =>
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

type TagInfo = {
  slug: string
  label: string
  count: number
}

const tags = computed<TagInfo[]>(() => {
  const map = new Map<string, TagInfo>()

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

      const slug = slugifyTag(label)
      if(!slug) {
        continue
      }

      const existing = map.get(slug)
      if(existing) {
        existing.count += 1
      } else {
        map.set(slug, { slug, label, count: 1 })
      }
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
      <h1>Tags</h1>
      <p>Browse recipes by tag.</p>
    </header>

    <ul class="tag-grid" aria-label="Tag list">
      <li v-for="tag in tags" :key="tag.slug" class="tag-grid__item">
        <NuxtLink class="tag-chip" :to="`/tags/${tag.slug}/`">
          <span class="tag-chip__label">{{ tag.label }}</span>
          <span class="tag-chip__count" aria-label="Recipe count">{{ tag.count }}</span>
        </NuxtLink>
      </li>
    </ul>

    <p v-if="!tags.length" class="empty">No tags found.</p>
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

.tag-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.tag-chip {
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

.tag-chip:hover {
  transform: translateY(-1px);
  border-color: var(--accent-border-soft);
  box-shadow: var(--shadow-lift);
}

.tag-chip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--accent-soft), var(--shadow-lift);
}

.tag-chip__label {
  color: var(--text);
  font-weight: 600;
}

.tag-chip__count {
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
