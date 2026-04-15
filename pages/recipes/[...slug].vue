<script setup lang="ts">
import type { RecipesCollectionItem } from '@nuxt/content'

type IngredientIndex = {
  names: string[]
  amountByName: Map<string, string>
}

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
const ingredientToast = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null
let clickListenerAttached = false
let ingredientIndex: IngredientIndex | null = null

const normalizeHeading = (value: string) => value.replace(/\s+/g, ' ').trim().toLowerCase()

const isHeadingElement = (element: Element) => /^H[1-6]$/.test(element.tagName)

const headingLevel = (element: Element) => {
  const level = Number(element.tagName.slice(1))
  return Number.isFinite(level) ? level : 6
}

const getSectionElements = (root: HTMLElement, title: string) => {
  const wanted = normalizeHeading(title)
  const headings = Array.from(root.querySelectorAll('h1,h2,h3,h4,h5,h6'))
  const startHeading = headings.find((heading) => normalizeHeading(heading.textContent || '') === wanted)

  if(!startHeading) {
    return []
  }

  const stopLevel = headingLevel(startHeading)
  const sectionElements: HTMLElement[] = []

  let cursor = startHeading.nextElementSibling as HTMLElement | null
  while(cursor) {
    if(isHeadingElement(cursor) && headingLevel(cursor) <= stopLevel) {
      break
    }

    sectionElements.push(cursor)
    cursor = cursor.nextElementSibling as HTMLElement | null
  }

  return sectionElements
}

const getIngredientIndexFromDom = (root: HTMLElement): IngredientIndex => {
  const sectionElements = getSectionElements(root, 'Ingredients')
  const amountByName = new Map<string, string>()
  const namesSet = new Set<string>()

  const listItems = sectionElements.flatMap((element) => Array.from(element.querySelectorAll('li')))
  for(const listItem of listItems) {
    const amountText = (listItem.textContent || '').replace(/\s+/g, ' ').trim()
    if(!amountText) {
      continue
    }

    const strongNodes = Array.from(listItem.querySelectorAll('strong'))
    for(const strongNode of strongNodes) {
      const ingredientNameRaw = (strongNode.textContent || '').replace(/\s+/g, ' ').trim()
      const ingredientName = ingredientNameRaw.toLowerCase()

      if(!ingredientName) {
        continue
      }

      namesSet.add(ingredientName)
      if(!amountByName.has(ingredientName)) {
        amountByName.set(ingredientName, amountText)
      }
    }
  }

  const names = Array.from(namesSet).sort((a, b) => b.length - a.length)
  return { names, amountByName }
}

const markIngredientsSection = (root: HTMLElement) => {
  const sectionElements = getSectionElements(root, 'Ingredients')
  for(const element of sectionElements) {
    element.classList.add('ingredients-section')
  }
}

const isWordChar = (value: string) => /[\p{L}\p{N}]/u.test(value)

const isBoundaryMatch = (textLower: string, start: number, matchLength: number) => {
  const beforeIndex = start - 1
  const afterIndex = start + matchLength
  const beforeChar = beforeIndex >= 0 ? textLower[beforeIndex] : ''
  const afterChar = afterIndex < textLower.length ? textLower[afterIndex] : ''

  if(beforeChar && isWordChar(beforeChar)) {
    return false
  }

  if(afterChar && isWordChar(afterChar)) {
    return false
  }

  return true
}

const enhanceDirectionsWithIngredientButtons = (root: HTMLElement, ingredientIndex: IngredientIndex) => {
  if(!ingredientIndex.names.length) {
    return
  }

  const sectionElements = getSectionElements(root, 'Directions')
  if(!sectionElements.length) {
    return
  }

  const ignoredParents = new Set(['A', 'BUTTON', 'CODE', 'PRE', 'SCRIPT', 'STYLE'])
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parent = node.parentElement
      if(!parent) {
        return NodeFilter.FILTER_REJECT
      }

      if(ignoredParents.has(parent.tagName)) {
        return NodeFilter.FILTER_REJECT
      }

      if(!sectionElements.some((element) => element.contains(parent))) {
        return NodeFilter.FILTER_REJECT
      }

      const value = (node.nodeValue || '').trim()
      if(!value) {
        return NodeFilter.FILTER_REJECT
      }

      return NodeFilter.FILTER_ACCEPT
    }
  })

  const nodesToProcess: Text[] = []
  let currentNode: Node | null = walker.nextNode()
  while(currentNode) {
    nodesToProcess.push(currentNode as Text)
    currentNode = walker.nextNode()
  }

  for(const textNode of nodesToProcess) {
    const originalText = textNode.nodeValue || ''
    const textLower = originalText.toLowerCase()

    let cursor = 0
    let changed = false
    const fragment = document.createDocumentFragment()

    while(cursor < originalText.length) {
      let bestIndex = -1
      let bestName = ''

      for(const name of ingredientIndex.names) {
        const index = textLower.indexOf(name, cursor)
        if(index === -1) {
          continue
        }

        if(!isBoundaryMatch(textLower, index, name.length)) {
          continue
        }

        if(bestIndex === -1 || index < bestIndex || (index === bestIndex && name.length > bestName.length)) {
          bestIndex = index
          bestName = name
        }
      }

      if(bestIndex === -1) {
        fragment.appendChild(document.createTextNode(originalText.slice(cursor)))
        break
      }

      if(bestIndex > cursor) {
        fragment.appendChild(document.createTextNode(originalText.slice(cursor, bestIndex)))
      }

      const matchedText = originalText.slice(bestIndex, bestIndex + bestName.length)
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'ingredient-ref'
      button.dataset.ingredient = bestName
      button.textContent = matchedText
      fragment.appendChild(button)

      changed = true
      cursor = bestIndex + bestName.length
    }

    if(changed && textNode.parentNode) {
      textNode.parentNode.replaceChild(fragment, textNode)
    }
  }
}

const showIngredientToast = (message: string) => {
  ingredientToast.value = message

  if(toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    ingredientToast.value = null
    toastTimer = null
  }, 2600)
}

const onRecipeContentClick = (event: Event) => {
  const target = event.target
  if(!(target instanceof HTMLElement)) {
    return
  }

  const button = target.closest('button.ingredient-ref') as HTMLButtonElement | null
  if(!button) {
    return
  }

  const key = (button.dataset.ingredient || '').toLowerCase()
  if(!key || !ingredientIndex) {
    return
  }

  const amount = ingredientIndex.amountByName.get(key)
  if(!amount) {
    return
  }

  showIngredientToast(amount)
}

const applyIngredientEnhancements = async () => {
  if(!import.meta.client) {
    return
  }

  const root = recipeContentRef.value
  if(!root) {
    return
  }

  await nextTick()

  ingredientIndex = getIngredientIndexFromDom(root)
  markIngredientsSection(root)
  enhanceDirectionsWithIngredientButtons(root, ingredientIndex)

  if(!clickListenerAttached) {
    root.addEventListener('click', onRecipeContentClick)
    clickListenerAttached = true
  }
}

onMounted(() => {
  applyIngredientEnhancements()
})

watch(() => page.value?.path, (value) => {
  if(!value) {
    return
  }

  ingredientToast.value = null
  applyIngredientEnhancements()
})

onBeforeUnmount(() => {
  if(toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }

  const root = recipeContentRef.value
  if(root && clickListenerAttached) {
    root.removeEventListener('click', onRecipeContentClick)
    clickListenerAttached = false
  }
})
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

          <div class="recipe-actions">
            <KeepAwakeToggle />
            <GroceryListButton :content-root="recipeContentRef" />
          </div>
        </header>

        <div ref="recipeContentRef" class="recipe-content">
          <ContentRenderer :value="recipePage" class="prose recipe-prose" />
        </div>

        <div v-if="ingredientToast" class="ingredient-toast" role="status" aria-live="polite">
          {{ ingredientToast }}
        </div>
      </article>
    </main>

    <AppToc :links="recipePage.body?.toc?.links" />
  </div>
</template>
