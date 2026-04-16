export default defineNuxtConfig({
  compatibilityDate: '2026-04-14',
  devtools: { enabled: true },
  modules: ['@nuxt/content'],
  css: ['~/assets/css/main.css', 'simplebar/dist/simplebar.css'],
  app: {
    head: {
      title: 'Recipes',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A docs-style recipe book powered by Nuxt Content.' }
      ]
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/recipes': { redirect: { to: '/', statusCode: 302 } },
    '/recipes/': { redirect: { to: '/', statusCode: 302 } },
    '/recipes/**': { prerender: true },
    '/category': { prerender: true },
    '/category/': { prerender: true },
    '/category/**': { prerender: true },
    '/tags/**': { prerender: true }
  },
  nitro: {
    prerender: {
      crawlLinks: true
    }
  },
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3
        }
      }
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  }
})