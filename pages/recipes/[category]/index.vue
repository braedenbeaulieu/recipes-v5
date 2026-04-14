<script setup lang="ts">
import { computed } from 'vue'
import { formatDuration } from '~/utils/formatDuration'
import type { RecipesCollectionItem } from '@nuxt/content'
import { formatCategory } from '~/utils/formatCategory'

const route = useRoute()
const category = computed(() => String(route.params.category || ''))

useSeoMeta({
  title: computed(() => `${formatCategory(category.value)} Recipes`),
  description: computed(() => `Browse ${formatCategory(category.value)} recipes.`)
})

interface RecipeItem {
  title: string
  path: string
  category: string
  description?: string
  prepTime?: string
  totalTime?: string
  servings?: string | number
  difficulty?: string
}

const { data: recipes } = await useAsyncData<RecipesCollectionItem[]>('recipes-index', () =>
  (queryCollection as any)('recipes')
    .where('published', '=', true)
    .order('path', 'ASC')
    .all()
)

const recipeItems = computed<RecipeItem[]>(() =>
  (recipes.value || []).map((recipe: RecipesCollectionItem): RecipeItem => ({
    title: recipe.title,
    path: recipe.path,
    category: recipe.path.split('/')[2] || 'uncategorized',
    description: recipe.description,
    prepTime: recipe.prepTime,
    totalTime: recipe.totalTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty
  }))
)

const categoryRecipes = computed(() =>
  recipeItems.value.filter(item => item.category === category.value)
)
</script>

<template>
  <div class="app-shell">
    <AppSidebar :items="recipeItems" />

    <main class="content-area">
      <header class="page-header">
        <h1>{{ formatCategory(category) }} Recipes</h1>
        <p>Pick a recipe from the sidebar or browse this category below.</p>
      </header>

      <section class="recipe-group">
        <h2>
          <NuxtLink :to="`/recipes/${category}/`">{{ formatCategory(category) }}</NuxtLink>
        </h2>

        <p v-if="!categoryRecipes.length">No recipes found in this category.</p>

        <div v-else class="recipe-grid">
          <NuxtLink
            v-for="recipe in categoryRecipes"
            :key="recipe.path"
            :to="recipe.path"
            class="recipe-card"
          >
            <div>
              <div class="recipe-card__header">
                <h3 class="recipe-card__title">{{ recipe.title }}</h3>
                <dl class="recipe-card__meta">
                  <div v-if="recipe.prepTime">
                    <dt class="meta-term">
                      <span class="screen-reader-text">Prep</span>
                      <svg width="32" height="32" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g><path d="m61.879 40.77c-6.418 0.55859-11.445 6.1875-11.445 12.812 0 2.6758 2.1758 4.8555 4.8516 4.8555h3.4102l-0.20703 5.0664c-0.039062 0.98828 0.3125 1.9258 1 2.6406 0.68359 0.71484 1.6055 1.1055 2.5938 1.1055h1.8438c0.98828 0 1.9102-0.39453 2.5938-1.1055 0.6875-0.71484 1.0391-1.6523 1-2.6406l-0.20703-5.0664h3.4102c2.6758 0 4.8516-2.1797 4.8516-4.8555v-0.27734c0-3.5195-1.4883-6.9023-4.082-9.2812-2.6328-2.4062-6.0469-3.5625-9.6133-3.2539zm11.691 12.812c0 1.5742-1.2773 2.8555-2.8516 2.8555h-4.4531c-0.27344 0-0.53125 0.10938-0.72266 0.30859-0.1875 0.19531-0.28906 0.46094-0.27734 0.73438l0.25 6.1094c0.019531 0.44141-0.14062 0.85547-0.44531 1.1758-0.30469 0.31641-0.71094 0.49219-1.1523 0.49219h-1.8438c-0.4375 0-0.84766-0.17578-1.1523-0.49219s-0.46094-0.73438-0.44531-1.1758l0.25-6.1094c0.011719-0.27344-0.089843-0.53906-0.27734-0.73438-0.1875-0.19531-0.44922-0.30859-0.72266-0.30859h-4.4531c-1.5703 0-2.8516-1.2812-2.8516-2.8555 0-5.5977 4.2266-10.352 9.6211-10.82 0.32031-0.027344 0.64062-0.042969 0.95703-0.042969 2.6523 0 5.1523 0.96875 7.125 2.7734 2.1836 2 3.4336 4.8477 3.4336 7.8086z"></path> <path d="m15.855 90c3.2305 0 5.8555-2.625 5.8555-5.8555v-23.41h6.7227c0.47656 0 0.88281-0.33594 0.98047-0.80078 8.5156-41.59-17.867-49.816-18.133-49.895-0.046875-0.015624-0.09375-0.003906-0.14062-0.011718-0.050781-0.007813-0.089844-0.027344-0.14062-0.027344-0.019531 0-0.035156 0.011719-0.058594 0.011719-0.070312 0.003906-0.13281 0.023437-0.19922 0.039062-0.0625 0.015625-0.12109 0.03125-0.17969 0.058594-0.054688 0.027344-0.10156 0.0625-0.14844 0.10156-0.054688 0.039062-0.10937 0.078124-0.15234 0.12891-0.039063 0.042968-0.066407 0.09375-0.09375 0.14062-0.039063 0.0625-0.078125 0.12109-0.10156 0.19141-0.007812 0.015625-0.019531 0.03125-0.023437 0.046875-0.011719 0.046875-0.003907 0.089844-0.011719 0.13672s-0.03125 0.09375-0.03125 0.14453v73.145c0 3.2305 2.625 5.8555 5.8555 5.8555zm3.8555-5.8555c0 2.125-1.7266 3.8555-3.8555 3.8555-2.125 0-3.8555-1.7305-3.8555-3.8555v-23.41h7.7109zm7.9062-25.41h-15.617v-46.297c5.0117 2.1133 22.332 12.039 15.617 46.297z"></path> <path d="m42.156 10c-3.3945 0-6.1562 2.7617-6.1562 6.1562v67.684c0 3.3984 2.7617 6.1602 6.1562 6.1602h41.684c3.3984 0 6.1602-2.7617 6.1602-6.1562v-67.688c0-3.3945-2.7617-6.1562-6.1562-6.1562zm45.844 6.1562v67.684c0 2.293-1.8672 4.1602-4.1562 4.1602h-41.688c-2.2891 0-4.1562-1.8672-4.1562-4.1562v-67.688c0-2.2891 1.8672-4.1562 4.1562-4.1562h41.684c2.293 0 4.1602 1.8672 4.1602 4.1562z"></path> <path d="m72.742 18.109h-19.484c-2.8242 0-5.125 2.2969-5.125 5.1445 0 2.8242 2.2969 5.125 5.125 5.125h19.484c2.8242 0 5.125-2.2969 5.125-5.1445 0-2.8281-2.3008-5.125-5.125-5.125zm0 8.2656h-19.484c-1.7227 0-3.125-1.4023-3.125-3.1445 0-1.7227 1.4023-3.125 3.125-3.125h19.484c1.7227 0 3.125 1.4023 3.125 3.1445 0 1.7266-1.4023 3.125-3.125 3.125z"></path></g></svg>
                    </dt>
                    <dd>{{ formatDuration(recipe.prepTime) }}</dd>
                  </div>
                  <div v-if="recipe.totalTime">
                    <dt class="meta-term">
                      <span class="screen-reader-text">Total</span>
                      <svg width="32" height="32" fill="currentColor" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g><path d="m85.227 43.75h-7.1016v-3.125h-75v3.2031c0 10.297 9.8945 18.672 22.059 18.672h30.883c10.938 0 20.012-6.7773 21.738-15.625h7.4219v3.125h11.648v-9.375h-11.648zm-10.227 0.078125c0 8.5703-8.4922 15.547-18.934 15.547h-30.883c-10.441 0-18.934-6.9766-18.934-15.547v-0.078125h68.75zm13.352-0.078125h5.3984v3.125h-5.3984z"></path><path d="m16.082 33.27 2.2109 2.2109 5.207-5.207c2.0469-2.0508 2.0469-5.3711 0-7.4219l-2.6016-2.6016c-0.82813-0.82812-0.82813-2.1719 0-3l5.207-5.207-2.2109-2.2109-5.207 5.207c-2.0469 2.0508-2.0469 5.3711 0 7.4219l2.6016 2.6016c0.82813 0.82813 0.82813 2.1719 0 3z"></path><path d="m36.395 33.27 2.2109 2.2109 5.207-5.207c2.0469-2.0508 2.0469-5.3711 0-7.4219l-2.6016-2.6016c-0.82813-0.82812-0.82813-2.1719 0-3l5.207-5.207-2.2109-2.2109-5.207 5.207c-2.0469 2.0508-2.0469 5.3711 0 7.4219l2.6016 2.6016c0.82813 0.82813 0.82813 2.1719 0 3z"></path><path d="m56.707 33.27 2.2109 2.2109 5.207-5.207c2.0469-2.0508 2.0469-5.3711 0-7.4219l-2.6016-2.6016c-0.82813-0.82812-0.82813-2.1719 0-3l5.207-5.207-2.2109-2.2109-5.207 5.207c-2.0469 2.0508-2.0469 5.3711 0 7.4219l2.6016 2.6016c0.82813 0.82813 0.82813 2.1719 0 3z"></path><path d="m92.188 76.562v-4.6875h-21.875v-6.25h-9.375v3.125h6.25v3.125h-23.438v-6.25h-3.125v6.25h-23.438v-3.125h6.25v-3.125h-9.375v6.25h-10.938v20.312h89.062v-6.25c2.5898 0 4.6875-2.0977 4.6875-4.6875s-2.0977-4.6875-4.6875-4.6875zm-3.125 12.5h-82.812v-14.062h82.812zm3.125-6.25v-3.125c0.86328 0 1.5625 0.69922 1.5625 1.5625s-0.69922 1.5625-1.5625 1.5625z"></path></g></svg>
                    </dt>
                    <dd>{{ formatDuration(recipe.totalTime) }}</dd>
                  </div>
                  <div v-if="recipe.servings">
                    <dt class="meta-term">
                      <span class="screen-reader-text">Servings</span>
                      <svg fill="currentColor" width="24" height="32" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M14.023,12.154c1.514-1.192,2.488-3.038,2.488-5.114c0-3.597-2.914-6.512-6.512-6.512 c-3.597,0-6.512,2.916-6.512,6.512c0,2.076,0.975,3.922,2.489,5.114c-2.714,1.385-4.625,4.117-4.836,7.318h1.186 c0.229-2.998,2.177-5.512,4.86-6.566c0.853,0.41,1.804,0.646,2.813,0.646c1.01,0,1.961-0.236,2.812-0.646 c2.684,1.055,4.633,3.568,4.859,6.566h1.188C18.648,16.271,16.736,13.539,14.023,12.154z M10,12.367 c-2.943,0-5.328-2.385-5.328-5.327c0-2.943,2.385-5.328,5.328-5.328c2.943,0,5.328,2.385,5.328,5.328 C15.328,9.982,12.943,12.367,10,12.367z"></path></svg>
                    </dt>
                    <dd>{{ recipe.servings }}</dd>
                  </div>
                </dl>
              </div>
              <p v-if="recipe.description">{{ recipe.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
