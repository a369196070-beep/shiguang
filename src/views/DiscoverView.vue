<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { store } from '../lib/store.js'
import { ui } from '../lib/ui.js'
import AppIcon from '../components/AppIcon.vue'
import RecipeCard from '../components/RecipeCard.vue'
import EmptyState from '../components/EmptyState.vue'

const q = ref('')
const category = ref('全部')
const difficulty = ref('全部')
const sort = ref('latest')
const searchInput = ref(null)

const stats = computed(() => store.stats())
const categories = computed(() => ['全部', ...store.categories.map((c) => c.name)])
const counts = computed(() => {
  const result = { 全部: store.getRecipes().length }
  store.categories.forEach((c) => { result[c.name] = 0 })
  store.getRecipes().forEach((r) => { if (result[r.category] != null) result[r.category] += 1 })
  return result
})

const hasFilters = computed(() => q.value.trim() !== '' || category.value !== '全部' || difficulty.value !== '全部')

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  const list = store.getRecipes().filter((recipe) => {
    if (category.value !== '全部' && recipe.category !== category.value) return false
    if (difficulty.value !== '全部' && recipe.difficulty !== difficulty.value) return false
    if (!needle) return true
    const author = store.getAuthor(recipe)
    const haystack = [
      recipe.title,
      recipe.description,
      recipe.category,
      recipe.tags.join(' '),
      recipe.ingredients.map((i) => i.name).join(' '),
      author?.name || ''
    ].join(' ').toLowerCase()
    return haystack.includes(needle)
  })
  if (sort.value === 'quick') list.sort((a, b) => a.time - b.time || new Date(b.createdAt) - new Date(a.createdAt))
  else if (sort.value === 'popular') list.sort((a, b) => (b.crowd || 0) - (a.crowd || 0) || new Date(b.createdAt) - new Date(a.createdAt))
  else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return list
})

const resultText = computed(() => hasFilters.value ? `找到 ${filtered.value.length} 道菜谱` : `共 ${filtered.value.length} 道菜谱`)

function reset() {
  q.value = ''
  category.value = '全部'
  difficulty.value = '全部'
}

function focusSearch() {
  searchInput.value?.focus()
}

watch(() => ui.focusSearch, focusSearch)
onMounted(() => { if (ui.focusSearch) setTimeout(focusSearch, 100) })
</script>

<template>
  <div class="page discover-page">
    <div class="container">
      <header class="page-head discover-head">
        <div>
          <span class="eyebrow"><span class="eyebrow-dot"></span>EXPLORE · 菜谱广场</span>
          <h1>发现下一道想做的菜。</h1>
          <p>{{ stats.recipes }} 道菜谱，来自 {{ stats.authors }} 位厨房朋友。搜一搜食材，或者随便逛逛。</p>
        </div>
        <div class="page-head-mark" aria-hidden="true"><span>{{ stats.recipes }}</span><small>道<br>好菜</small></div>
      </header>

      <div class="discover-toolbar">
        <div class="search-field">
          <AppIcon name="search" class="search-field-icon" />
          <input ref="searchInput" v-model="q" type="search" placeholder="搜索菜名、食材或作者…" autocomplete="off" aria-label="搜索菜谱">
          <button v-show="q" class="search-clear" type="button" aria-label="清空搜索" @click="q = ''"><AppIcon name="close" /></button>
        </div>
        <div class="select-field">
          <label for="sortSelect">排序</label>
          <select id="sortSelect" v-model="sort">
            <option value="latest">最新发布</option>
            <option value="quick">快手优先</option>
            <option value="popular">人气优先</option>
          </select>
        </div>
        <div class="select-field">
          <label for="difficultySelect">难度</label>
          <select id="difficultySelect" v-model="difficulty">
            <option v-for="level in ['全部', ...store.difficulties]" :key="level" :value="level">{{ level }}</option>
          </select>
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-pills" role="group" aria-label="按分类筛选">
          <button
            v-for="cat in categories"
            :key="cat"
            class="filter-pill"
            :class="{ 'is-active': category === cat }"
            type="button"
            :aria-pressed="category === cat"
            @click="category = cat"
          >{{ cat }}<span>{{ counts[cat] || 0 }}</span></button>
        </div>
      </div>

      <div class="result-row">
        <p class="result-count" aria-live="polite">{{ resultText }}</p>
        <button v-show="hasFilters" class="text-btn" type="button" @click="reset">清空筛选<AppIcon name="close" /></button>
      </div>

      <div v-if="filtered.length" class="recipe-grid recipe-grid--3">
        <RecipeCard v-for="recipe in filtered" :key="recipe.id" :recipe="recipe" />
      </div>
      <EmptyState
        v-else
        emoji="🥢"
        kicker="NO MATCHES"
        title="没有找到这道菜"
        text="换个食材或分类试试，也许灵感就在下一道。"
        action-label="清空筛选条件"
        @action="reset"
      />
    </div>
  </div>
</template>
