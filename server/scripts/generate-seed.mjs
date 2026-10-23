import seed from '../../src/data/seed.js'
import { writeFileSync } from 'node:fs'

const DEMO_HASH = process.env.DEMO_HASH || '$2b$10$K3C9HBRrFKyNN/ygYS3SQe.wEdHNrwJT3qmSM/t0YhuQcIs7NB3qm'

function q(value) {
  if (value === null || value === undefined) return 'NULL'
  return "'" + String(value).replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\r?\n/g, '\\n') + "'"
}

function dt(value) {
  return q(String(value).slice(0, 19).replace('T', ' '))
}

const userId = new Map(seed.users.map((user, index) => [user.id, index + 1]))
const tagNames = [...new Set(seed.recipes.flatMap((recipe) => recipe.tags).filter((tag) => seed.tags.includes(tag)))]
const tagId = new Map(tagNames.map((tag, index) => [tag, index + 1]))

const lines = []
lines.push('-- 由 scripts/generate-seed.mjs 从 src/data/seed.js 生成，请勿手工修改。')
lines.push('SET NAMES utf8mb4;')
lines.push('')

lines.push('INSERT INTO users (id, name, email, password_hash, bio, avatar_color, verified, created_at) VALUES')
lines.push(seed.users.map((user, index) => {
  const id = index + 1
  return `(${id}, ${q(user.name)}, ${q(user.email)}, ${q(DEMO_HASH)}, ${q(user.bio)}, ${q(user.avatarColor)}, ${user.verified ? 1 : 0}, ${dt(user.joinedAt)})`
}).join(',\n') + ';')
lines.push('')

lines.push('INSERT INTO tags (id, name) VALUES')
lines.push(tagNames.map((tag, index) => `(${index + 1}, ${q(tag)})`).join(',\n') + ';')
lines.push('')

const recipeRows = []
const ingredientRows = []
const stepRows = []
const recipeTagRows = []

seed.recipes.forEach((recipe, index) => {
  const id = index + 1
  const authorId = userId.get(recipe.authorId)
  if (!authorId) throw new Error(`unknown author ${recipe.authorId}`)
  const validTags = recipe.tags.filter((tag) => tagId.has(tag)).slice(0, 6)
  recipeRows.push(`(${id}, ${authorId}, ${q(recipe.title)}, ${q(recipe.emoji)}, ${q(recipe.category)}, ${q(recipe.description)}, ${recipe.time}, ${q(recipe.difficulty)}, ${recipe.servings}, ${q(recipe.tip || '')}, NULL, ${recipe.crowd || 0}, 'seed', ${dt(recipe.createdAt)})`)
  recipe.ingredients.forEach((ing, i) => {
    ingredientRows.push(`(${id}, ${q(ing.name)}, ${q(ing.amount || '适量')}, ${i})`)
  })
  recipe.steps.forEach((step, i) => {
    stepRows.push(`(${id}, ${q(step)}, ${i})`)
  })
  validTags.forEach((tag) => {
    recipeTagRows.push(`(${id}, ${tagId.get(tag)})`)
  })
})

lines.push('INSERT INTO recipes (id, author_id, title, emoji, category, description, cook_time, difficulty, servings, tip, cover_url, crowd, source, created_at) VALUES')
lines.push(recipeRows.join(',\n') + ';')
lines.push('')

lines.push('INSERT INTO ingredients (recipe_id, name, amount, sort_no) VALUES')
lines.push(ingredientRows.join(',\n') + ';')
lines.push('')

lines.push('INSERT INTO recipe_steps (recipe_id, content, sort_no) VALUES')
lines.push(stepRows.join(',\n') + ';')
lines.push('')

lines.push('INSERT INTO recipe_tags (recipe_id, tag_id) VALUES')
lines.push(recipeTagRows.join(',\n') + ';')
lines.push('')

lines.push(`ALTER TABLE users AUTO_INCREMENT = ${seed.users.length + 1};`)
lines.push(`ALTER TABLE recipes AUTO_INCREMENT = ${seed.recipes.length + 1};`)
lines.push(`ALTER TABLE tags AUTO_INCREMENT = ${tagNames.length + 1};`)

const out = process.argv[2] || 'src/main/resources/db/migration/V2__seed.sql'
writeFileSync(out, lines.join('\n') + '\n', 'utf8')
console.log(`wrote ${out}: ${seed.users.length} users, ${seed.recipes.length} recipes, ${tagNames.length} tags, ${ingredientRows.length} ingredients, ${stepRows.length} steps`)
