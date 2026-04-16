<script setup lang="ts">
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
  </aside>
</template>

<style scoped lang="scss">
.toc {
  position: sticky;
  top: 1.5rem;
  height: calc(100vh - 3rem);
  overflow-y: auto;
  padding: 0;
  background: var(--toc-bg);
  border-radius: 22px;
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
  transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
  padding: 0.35rem 0;
}

.toc__link:hover {
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
    border-radius: 22px;
  }
}
</style>
