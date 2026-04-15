<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatCategory } from '~/utils/formatCategory'

interface SidebarItem {
  title: string
  path: string
  category: string
}

const props = defineProps<{
  items: SidebarItem[]
  currentPath?: string
}>()

const search = ref('')

const isMobile = ref(false)
const isSidebarOpen = ref(false)

const onAccordionEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0px'
  element.offsetHeight
  element.style.height = `${element.scrollHeight}px`
}

const onAccordionAfterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = ''
}

const onAccordionLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = `${element.scrollHeight}px`
  element.offsetHeight
  element.style.height = '0px'
}

const onAccordionAfterLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = ''
}

let mql: MediaQueryList | null = null
const mqlHandler = () => syncViewport()

const syncViewport = () => {
  if(!import.meta.client) {
    return
  }

  isMobile.value = window.matchMedia('(max-width: 860px)').matches
  isSidebarOpen.value = !isMobile.value
}

onMounted(() => {
  if(!import.meta.client) {
    return
  }

  mql = window.matchMedia('(max-width: 860px)')

  syncViewport()

  if(mql && 'addEventListener' in mql) {
    mql.addEventListener('change', mqlHandler)
  } else {
    // @ts-expect-error - Safari < 14
    mql?.addListener(mqlHandler)
  }
})

onBeforeUnmount(() => {
  if(!mql) {
    return
  }

  if('removeEventListener' in mql) {
    mql.removeEventListener('change', mqlHandler)
  } else {
    // @ts-expect-error - Safari < 14
    mql.removeListener(mqlHandler)
  }
})

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase()

  if (!term) {
    return props.items
  }

  return props.items.filter((item) => {
    return (
      item.title.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    )
  })
})

const groupedItems = computed(() => {
  return filteredItems.value.reduce<Record<string, SidebarItem[]>>((acc, item: SidebarItem) => {
    const list = acc[item.category]||[]
    list.push(item)
    acc[item.category] = list
    return acc
  }, {})
})

</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__inner">
      <div class="sidebar__mobile-header">
        <NuxtLink to="/" class="brand">
          <strong>Recipe Book</strong>
        </NuxtLink>

        <button
          type="button"
          class="sidebar__toggle"
          :aria-expanded="isSidebarOpen"
          aria-controls="sidebar-panel"
          @click="isSidebarOpen=!isSidebarOpen"
        >
          <span class="screen-reader-text">Toggle sidebar</span>
          <svg class="sidebar__toggle-icon" width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <Transition
        name="sidebar-accordion"
        @enter="onAccordionEnter"
        @after-enter="onAccordionAfterEnter"
        @leave="onAccordionLeave"
        @after-leave="onAccordionAfterLeave"
      >
        <div
          id="sidebar-panel"
          class="sidebar__panel"
          :class="{ 'is-open': isSidebarOpen }"
          v-show="!isMobile||isSidebarOpen"
        >
        <div class="sidebar__search-wrap">
          <label class="sidebar__search-label screen-reader-text" for="recipe-search">Search recipes</label>
          <input
            id="recipe-search"
            v-model="search"
            type="search"
            class="sidebar__search"
            placeholder="Search recipes..."
          >
        </div>

        <nav class="sidebar__nav" aria-label="Recipe navigation">
          <section v-for="(group, category) in groupedItems" :key="category" class="sidebar__group">
            <h2 class="sidebar__heading">
              <NuxtLink :to="`/recipes/${category}/`">{{ formatCategory(category) }}</NuxtLink>
            </h2>
            <ul class="sidebar__list">
              <li v-for="item in group" :key="item.path">
                <NuxtLink
                  :to="item.path"
                  class="sidebar__link"
                  :class="{ 'is-active': item.path === currentPath }"
                >
                  {{ item.title }}
                </NuxtLink>
              </li>
            </ul>
          </section>

          <p v-if="!filteredItems.length" class="sidebar__empty">No recipes match your search.</p>
        </nav>
        </div>
      </Transition>
    </div>
  </aside>
</template>
