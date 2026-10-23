<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { route } from './lib/router.js'
import { store } from './lib/store.js'
import { completeAuth, ui } from './lib/ui.js'
import AppHeader from './components/AppHeader.vue'
import AuthDialog from './components/AuthDialog.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import MobileTabbar from './components/MobileTabbar.vue'
import SiteFooter from './components/SiteFooter.vue'
import ToastHost from './components/ToastHost.vue'
import DiscoverView from './views/DiscoverView.vue'
import FavoritesView from './views/FavoritesView.vue'
import HomeView from './views/HomeView.vue'
import MineView from './views/MineView.vue'
import NotFoundView from './views/NotFoundView.vue'
import RecipeView from './views/RecipeView.vue'
import UploadView from './views/UploadView.vue'

const views = {
  home: HomeView,
  discover: DiscoverView,
  favorites: FavoritesView,
  upload: UploadView,
  mine: MineView,
  recipe: RecipeView,
  notfound: NotFoundView
}

const view = computed(() => views[route.name] || NotFoundView)
const routeKey = computed(() => `${route.name}:${route.id || ''}`)
const mainEl = ref(null)

function skipToMain() {
  const el = mainEl.value
  if (!el) return
  el.focus()
  el.scrollIntoView({ block: 'start' })
}

watch(routeKey, () => {
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }))
})

watch(() => store.currentUser.value?.id || 'guest', () => {
  ui.menuNonce = 0
})

watchEffect(() => {
  document.body.className = route.name === 'home' ? 'is-home' : ''
})

function onAuthSuccess(user) {
  completeAuth(user)
}

function retry() {
  store.init()
}
</script>

<template>
  <a class="skip-link" href="#main" @click.prevent="skipToMain">跳到主要内容</a>
  <div v-if="store.db.error" class="server-alert" role="alert">
    <strong>厨房服务没有连上</strong>
    <span>{{ store.db.error }}</span>
    <button class="btn btn-mini btn-ghost" type="button" @click="retry">重试</button>
  </div>
  <AppHeader />
  <main id="main" ref="mainEl" class="site-main" tabindex="-1">
    <component :is="view" :key="routeKey" v-bind="route.name === 'recipe' ? { id: route.id } : {}" />
  </main>
  <SiteFooter />
  <MobileTabbar />
  <AuthDialog @success="onAuthSuccess" />
  <ConfirmDialog />
  <ToastHost />
</template>
