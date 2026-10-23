<script setup>
import { computed } from 'vue'
import { store } from '../lib/store.js'
import { formatJoined } from '../lib/format.js'
import AuthGate from '../components/AuthGate.vue'
import AppIcon from '../components/AppIcon.vue'
import RecipeCard from '../components/RecipeCard.vue'
import EmptyState from '../components/EmptyState.vue'
import UserAvatar from '../components/UserAvatar.vue'

const user = computed(() => store.currentUser.value)
const uploads = computed(() => user.value ? store.userRecipes(user.value.id) : [])
const favoriteCount = computed(() => store.favoriteRecipes().length)
const memoryOnly = computed(() => store.isMemoryOnly())
</script>

<template>
  <AuthGate
    v-if="!user"
    emoji="🍳"
    kicker="MY KITCHEN"
    title="先登录，看看你的厨房。"
    text="上传过的菜谱、收到的收藏，都会安静地待在这里。"
  />
  <div v-else class="page mine-page">
    <div class="container">
      <div v-if="memoryOnly" class="memory-warning" role="alert">当前浏览器禁用了本地存储，刷新页面后数据会丢失。</div>

      <section class="profile-card">
        <div class="profile-main">
          <UserAvatar :user="user" size="xl" />
          <div class="profile-copy">
            <span class="eyebrow"><span class="eyebrow-dot"></span>MY KITCHEN · 我的厨房</span>
            <h1>{{ user.name }}的厨房<span v-if="user.verified" class="verified"><AppIcon name="check" /></span></h1>
            <p class="profile-bio">{{ user.bio || '刚刚开了一间小厨房。' }}</p>
            <div class="profile-meta">
              <span>{{ user.email }}</span><span class="meta-sep"></span><span>{{ formatJoined(user.joinedAt) }}</span>
            </div>
          </div>
        </div>
        <div class="profile-stats">
          <div><strong>{{ uploads.length }}</strong><span>道拿手菜</span></div>
          <div><strong>{{ favoriteCount }}</strong><span>道收藏</span></div>
          <div class="profile-stats-action">
            <a class="btn btn-primary" href="#/upload"><AppIcon name="plus" /><span>上传新菜</span></a>
          </div>
        </div>
      </section>

      <div class="section-head section-head--compact">
        <div>
          <h2>我的菜谱</h2>
          <p>你端上桌的每一道菜，都在这里。</p>
        </div>
        <a v-if="uploads.length" class="btn btn-text" href="#/discover">去看看别人的菜<AppIcon name="arrow" /></a>
      </div>

      <div v-if="uploads.length" class="recipe-grid recipe-grid--3">
        <RecipeCard v-for="recipe in uploads" :key="recipe.id" :recipe="recipe" manage />
      </div>
      <EmptyState
        v-else
        emoji="🍳"
        kicker="YOUR FIRST DISH"
        title="还没有端上来的菜"
        text="写下你的第一道拿手菜，让它出现在别人的今日菜单里。"
        action-label="上传第一道菜"
        href="#/upload"
      />
    </div>
  </div>
</template>
