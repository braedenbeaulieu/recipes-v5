<script setup lang="ts">
import SimpleBar from 'simplebar-vue'

defineProps<{
  links?: Array<{
    id: string
    depth: number
    text: string
    children?: Array<{
      id: string
      depth: number
      text: string
    }>
  }>
}>()
</script>

<template>
  <aside class="toc" v-if="links?.length">
    <SimpleBar class="toc__scroll">
      <div class="toc__inner">
      <p class="toc__title">On the menu</p>
      <ul class="toc__list">
        <li v-for="link in links" :key="link.id">
          <a :href="`#${link.id}`" class="toc__link" :class="`depth-${link.depth}`">
            {{ link.text }}
          </a>
          <ul v-if="link.children?.length" class="toc__children">
            <li v-for="child in link.children" :key="child.id">
              <a :href="`#${child.id}`" class="toc__link" :class="`depth-${child.depth}`">
                {{ child.text }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    </SimpleBar>
  </aside>
</template>

<style scoped lang="scss">
.toc {
  position: sticky;
  top: 1.5rem;
  height: calc(100vh - 3rem);
  overflow: hidden;
  padding: 0;
  background: var(--toc-bg);
  border-radius: 22px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
}

.toc__scroll {
  height: 100%;
}

.toc__scroll :deep(.simplebar-track.simplebar-vertical) {
  width: 10px;
  top: var(--scrollbar-inset);
  bottom: var(--scrollbar-inset);
}

.toc__scroll :deep(.simplebar-track.simplebar-vertical) {
  background: transparent;
}

.toc__scroll :deep(.simplebar-scrollbar:before) {
  background: var(--scrollbar-thumb);
  border-radius: 999px;
  left: 2px;
  right: 2px;
}

.toc__scroll :deep(.simplebar-scrollbar:hover:before) {
  background: var(--scrollbar-thumb-hover);
}

.toc__inner {
  min-height: 100%;
  padding: 1.25rem;
}

.toc__title {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: var(--text);
  margin-top: 0;
}

.toc__list,
.toc__children {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc__link {
  display: block;
  color: var(--muted);
  border-radius: 12px;
  transition: background 0.15s ease, color 0.15s ease;
  padding: 0.35rem 0.5rem;
  margin: 0.1rem 0;
}

.toc__link:hover {
  color: var(--text);
  background: var(--surface-hover);
}

.toc__link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--accent-soft);
  background: var(--surface-hover);
  color: var(--text);
}

.toc__children {
  padding-left: 0.9rem;
}

.depth-3 {
  padding-left: 0.75rem;
}

@media (max-width: 1180px) {
  .toc {
    display: none;
  }
}

@media (max-width: 860px) {
  .toc {
    position: static;
    height: auto;
    overflow: visible;
    border-radius: 22px;
  }

  .toc__scroll {
    height: auto;
  }
}
</style>
