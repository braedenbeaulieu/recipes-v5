<template>
  <div class="app-shell">
    <slot name="sidebar" />

    <main class="content-area">
      <slot />
    </main>

    <slot name="toc" />
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr) 260px;
  gap: 0;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.content-area {
  min-width: 0;
  padding: 2rem clamp(1rem, 4vw, 3rem) 4rem;
}

@media (max-width: 1180px) {
  .app-shell {
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
