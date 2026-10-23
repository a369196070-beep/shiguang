<script setup>
import { computed } from 'vue'
import { store } from '../lib/store.js'
import AuthGate from '../components/AuthGate.vue'
import RecipeCard from '../components/RecipeCard.vue'
import EmptyState from '../components/EmptyState.vue'

const user = computed(() => store.currentUser.value)
const favorites = computed(() => store.favoriteRecipes())
</script>

<template>
  <AuthGate
    v-if="!user"
    emoji="🧺"
    kicker="MY RECIPE BOX"
    title="登录后，把喜欢的菜收好。"
    text="收藏会记在你的账号里，等一个有空下厨的日子。"
  />
  <div v-else class="page favorites-page">
    <div class="container">
      <header class="page-head">
        <div>
          <span class="eyebrow"><span class="eyebrow-dot"></span>MY RECIPE BOX · 收藏盒</span>
          <h1>我的收藏</h1>
          <p>把想做的菜先放在这里，等一个有空下厨的日子。</p>
        </div>
        <div class="page-head-aside"><span class="count-badge"><strong>{{ favorites.length }}</strong> 道收藏</span></div>
      </header>

      <div v-if="favorites.length" class="recipe-grid recipe-grid--3">
        <RecipeCard v-for="recipe in favorites" :key="recipe.id" :recipe="recipe" />
      </div>
      <EmptyState
        v-else
        emoji="🧺"
        kicker="YOUR BOX IS EMPTY"
        title="收藏盒还是空的"
        text="去菜谱广场逛逛，遇到想做的菜就点一下爱心。"
        action-label="去发现菜谱"
        href="#/discover"
      />
    </div>
  </div>
</template>
