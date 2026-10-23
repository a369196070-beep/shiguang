import { computed, reactive } from 'vue'
import { api } from './api.js'

const DRAFT_KEY = 'shiguang.draft.v1'
const DEFAULT_CATEGORIES = [
  { name: '家常菜', emoji: '🍳', tone: ['#F4D6BE', '#D98C5F'] },
  { name: '快手菜', emoji: '⚡', tone: ['#F6E5BD', '#DDAE55'] },
  { name: '素菜', emoji: '🥬', tone: ['#DDE7CC', '#8CA36B'] },
  { name: '汤羹', emoji: '🍲', tone: ['#F2D9CC', '#C57E68'] },
  { name: '主食', emoji: '🍚', tone: ['#EDE0C8', '#BC9A6B'] },
  { name: '甜品', emoji: '🍰', tone: ['#F5DCE2', '#C98CA1'] }
]

const db = reactive({
  ready: false,
  loading: false,
  error: '',
  user: null,
  users: [],
  recipes: [],
  favorites: [],
  menu: []
})

const categories = reactive(DEFAULT_CATEGORIES.map((item) => ({ ...item })))
const tags = reactive([])
const difficulties = reactive(['简单', '中等', '进阶'])
const demoAccount = reactive({ email: 'xiaoman@shiguang.app', password: '123456' })

const currentUser = computed(() => db.user)

function replaceList(target, values) {
  target.splice(0, target.length, ...values)
}

function applyBootstrap(data) {
  db.user = data.user || null
  db.users = Array.isArray(data.users) ? data.users : []
  db.recipes = Array.isArray(data.recipes) ? data.recipes : []
  db.favorites = Array.isArray(data.favorites) ? data.favorites : []
  db.menu = Array.isArray(data.menu?.items) ? data.menu.items : []
  if (Array.isArray(data.categories) && data.categories.length) replaceList(categories, data.categories)
  if (Array.isArray(data.tags) && data.tags.length) replaceList(tags, data.tags)
  if (Array.isArray(data.difficulties) && data.difficulties.length) replaceList(difficulties, data.difficulties)
  if (data.demoAccount) Object.assign(demoAccount, data.demoAccount)
  db.error = ''
}

async function init() {
  if (db.loading) return
  db.loading = true
  try {
    applyBootstrap(await api.get('/bootstrap'))
  } catch (error) {
    db.error = error.message || '厨房服务暂时没有回应。'
  } finally {
    db.loading = false
    db.ready = true
  }
}

async function refresh() {
  const data = await api.get('/bootstrap')
  applyBootstrap(data)
  return data
}

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getRecipes() {
  return db.recipes.slice()
}

function getRecipe(id) {
  return db.recipes.find((recipe) => String(recipe.id) === String(id)) || null
}

function getUser(id) {
  return db.users.find((user) => String(user.id) === String(id)) || null
}

function getAuthor(recipe) {
  if (!recipe) return null
  return getUser(recipe.authorId) || { id: 'unknown', name: '一位厨房朋友', avatarColor: '#8A8274', verified: false, bio: '' }
}

function getCategory(name) {
  return categories.find((item) => item.name === name) || categories[0]
}

function isFavorite(id) {
  return db.favorites.some((item) => String(item) === String(id))
}

function favoriteRecipes() {
  return db.favorites.map(getRecipe).filter(Boolean)
}

function userRecipes(userId) {
  return db.recipes
    .filter((recipe) => String(recipe.authorId) === String(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function officialUserId() {
  return db.users.find((user) => user.email === 'hello@shiguang.app')?.id ?? 1
}

function communityRecipes(limit) {
  const official = officialUserId()
  const list = db.recipes
    .filter((recipe) => String(recipe.authorId) !== String(official))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return typeof limit === 'number' ? list.slice(0, limit) : list
}

function stats() {
  return {
    recipes: db.recipes.length,
    authors: new Set(db.recipes.map((recipe) => String(recipe.authorId))).size
  }
}

function relatedRecipes(recipe, limit = 3) {
  if (!recipe) return []
  return db.recipes
    .filter((item) => String(item.id) !== String(recipe.id))
    .map((item) => {
      let score = item.category === recipe.category ? 4 : 0
      ;(item.tags || []).forEach((tag) => { if ((recipe.tags || []).includes(tag)) score += 1 })
      if (String(item.authorId) === String(recipe.authorId)) score += 1
      return { recipe: item, score }
    })
    .sort((a, b) => b.score - a.score || new Date(b.recipe.createdAt) - new Date(a.recipe.createdAt))
    .slice(0, limit)
    .map((item) => item.recipe)
}

function getDailyMenu() {
  return db.menu
}

async function loadMenu(shuffle = false) {
  const data = shuffle ? await api.post('/menu/shuffle') : await api.get('/menu/today')
  db.menu = Array.isArray(data?.items) ? data.items : []
  return db.menu
}

async function login(email, password) {
  try {
    const data = await api.post('/auth/login', { email, password })
    await refresh()
    return { ok: true, user: data.user }
  } catch (error) {
    return { ok: false, error: error.message || '登录失败，请稍后再试。' }
  }
}

async function register(form) {
  try {
    const data = await api.post('/auth/register', {
      name: form.name,
      email: form.email,
      password: form.password,
      confirm: form.confirm
    })
    await refresh()
    return { ok: true, user: data.user }
  } catch (error) {
    return { ok: false, error: error.message || '注册失败，请稍后再试。' }
  }
}

async function logout() {
  try {
    await api.post('/auth/logout')
  } catch {
    /* a dead session should still clear the UI */
  }
  try {
    await refresh()
  } catch {
    db.user = null
    db.favorites = []
    db.menu = []
  }
}

async function toggleFavorite(id) {
  try {
    const path = `/recipes/${encodeURIComponent(id)}/favorite`
    const data = isFavorite(id) ? await api.del(path) : await api.post(path)
    if (data.favorited) {
      if (!isFavorite(id)) db.favorites.push(id)
    } else {
      db.favorites = db.favorites.filter((item) => String(item) !== String(id))
    }
    const recipe = getRecipe(id)
    if (recipe && typeof data.crowd === 'number') recipe.crowd = data.crowd
    return { ok: true, favorited: Boolean(data.favorited) }
  } catch (error) {
    return { ok: false, error: error.message || '收藏失败，请稍后再试。' }
  }
}

function dataUrlToBlob(dataUrl) {
  const [meta, base64] = String(dataUrl).split(',')
  const mime = meta.match(/data:([^;]+)/)?.[1] || 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

async function uploadCover(image) {
  if (!image) return null
  if (!String(image).startsWith('data:image/')) return image
  const formData = new FormData()
  formData.append('file', dataUrlToBlob(image), 'cover.jpg')
  const data = await api.upload('/uploads/image', formData)
  return data.url
}

async function addRecipe(form) {
  try {
    const image = await uploadCover(form.image)
    const recipe = await api.post('/recipes', {
      title: form.title,
      category: form.category,
      description: form.description,
      time: Number(form.time) || 30,
      servings: Number(form.servings) || 2,
      difficulty: form.difficulty,
      tip: form.tip,
      image,
      tags: form.tags,
      ingredients: form.ingredients.filter((item) => String(item.name || '').trim()),
      steps: form.steps.filter((step) => String(step || '').trim())
    })
    db.recipes.unshift(recipe)
    return { ok: true, recipe }
  } catch (error) {
    return { ok: false, error: error.message || '发布失败，请稍后再试。' }
  }
}

async function deleteRecipe(id) {
  try {
    await api.del(`/recipes/${encodeURIComponent(id)}`)
    db.recipes = db.recipes.filter((recipe) => String(recipe.id) !== String(id))
    db.favorites = db.favorites.filter((item) => String(item) !== String(id))
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error.message || '删除失败，请稍后再试。' }
  }
}

function getDraft() {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveDraft(data) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

function clearDraft() {
  try { window.localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
}

export const store = {
  db,
  categories,
  tags,
  difficulties,
  demoAccount,
  currentUser,
  dateKey,
  init,
  refresh,
  getRecipes,
  getRecipe,
  getUser,
  getAuthor,
  getCategory,
  isFavorite,
  favoriteRecipes,
  userRecipes,
  communityRecipes,
  relatedRecipes,
  stats,
  getDailyMenu,
  loadMenu,
  login,
  register,
  logout,
  toggleFavorite,
  addRecipe,
  deleteRecipe,
  getDraft,
  saveDraft,
  clearDraft,
  isMemoryOnly: () => false
}
