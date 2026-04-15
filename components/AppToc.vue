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
