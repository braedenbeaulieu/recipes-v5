import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    recipes: defineCollection({
      type: 'page',
      source: 'recipes/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        prepTime: z.string().optional(),
        cookTime: z.string().optional(),
        totalTime: z.string().optional(),
        servings: z.union([z.string(), z.number()]).optional(),
        difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
        tags: z.array(z.string()).optional(),
        image: z.string().optional().nullable(),
        published: z.boolean().optional().default(true)
      })
    })
  }
})
