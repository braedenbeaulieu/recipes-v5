<script setup lang="ts">
const slots = useSlots()
const hasToc = computed(() => Boolean(slots.toc))
</script>

<template>
  <div class="app-shell" :class="{ 'has-toc': hasToc }">
    <slot name="sidebar" />

    <main class="content-area">
      <slot />
    </main>

    <slot v-if="hasToc" name="toc" />
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.app-shell.has-toc {
  grid-template-columns: 300px minmax(0, 1fr) 260px;
}

.content-area {
  min-width: 0;
  padding: 2rem clamp(1rem, 4vw, 3rem) 4rem;
}

@media (max-width: 1180px) {
  .app-shell {
    grid-template-columns: 280px minmax(0, 1fr);
  }

  .app-shell.has-toc {
    grid-template-columns: 280px minmax(0, 1fr);
  }

  .content-area {
    border-radius: 0 22px 22px 0;
  }
}

@media (max-width: 860px) {
  .app-shell {
    display: block;
    padding: 1rem;
  }

  .content-area {
    padding-top: 1.25rem;
    border-radius: 22px;
  }
}
</style>
