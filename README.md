Disclaimer: This project has been ~99% written with AI.

# Recipe Book (Nuxt Content)

A docs-style recipe site built with Nuxt + @nuxt/content.

## Creating a new recipe

1. Add a Markdown file under `content/recipes/<category>/<slug>.md`.
2. Include frontmatter similar to existing recipes (title, description, times, tags, etc.).
3. Use these section headings (spelling matters):
   - `## Ingredients`
   - `## Directions`

### Ingredients → Directions ingredient buttons (strict)

This site has a strict helper that turns ingredient mentions in the Directions into clickable buttons that show the ingredient amount (so you don’t need to scroll back up).

Rules (designed to be obvious and consistent):

- Only ingredient names explicitly marked in the Ingredients list are eligible.
- Mark an ingredient name by wrapping it in `**double-asterisks**` inside the ingredient bullet.
- Matching in Directions is case-insensitive, but otherwise strict:
  - Exact whole-word / whole-phrase match only
  - No singular/plural guessing, no stemming, no synonyms

The notification text shown on click is the full ingredient bullet line.

Examples:

- Ingredient line:
  - `- 2 tbsp **butter**`
  - In Directions, `Add the butter` → `butter` becomes a button and shows `2 tbsp butter`

- Multi-word ingredient:
  - `- 2 lb **ground beef**`
  - In Directions, `Brown the ground beef` → `ground beef` becomes a button

- Split ingredients in one bullet:
  - `- **salt** and **pepper**, to taste`

Notes:

- The `**...**` markers are used only as a strict “this is an ingredient key” signal. The Ingredients list is styled so these markers do not visually appear as bold.
- If you don’t mark an ingredient name with `**...**`, it will never be turned into a button in Directions.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run generate`
