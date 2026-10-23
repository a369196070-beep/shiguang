<script setup>
import { computed, ref, watch } from 'vue'
import { store } from '../lib/store.js'
import { notify } from '../lib/ui.js'
import { MONTHS_EN, WEEKDAYS, formatDateLong } from '../lib/format.js'
import AppIcon from '../components/AppIcon.vue'
import DishArt from '../components/DishArt.vue'
import RecipeCard from '../components/RecipeCard.vue'
import UserAvatar from '../components/UserAvatar.vue'
import EmptyState from '../components/EmptyState.vue'

const now = new Date()
const stats = computed(() => store.stats())
const menu = ref([])
const shuffling = ref(false)
watch(() => store.db.menu, (items) => { menu.value = Array.isArray(items) ? items : [] }, { immediate: true })
const featured = computed(() => menu.value[0]?.recipe || store.getRecipes()[0] || null)
const community = computed(() => store.communityRecipes(4))
const author = computed(() => featured.value ? store.getAuthor(featured.value) : null)
const featureIngredients = computed(() => featured.value?.ingredients.slice(0, 4) || [])
const featureSteps = computed(() => featured.value?.steps.slice(0, 2) || [])
const remainIngredients = computed(() => Math.max(0, (featured.value?.ingredients.length || 0) - featureIngredients.value.length))
const remainSteps = computed(() => Math.max(0, (featured.value?.steps.length || 0) - featureSteps.value.length))
const menuTotal = computed(() => menu.value.reduce((sum, item) => sum + Number(item.recipe.time || 0), 0))

async function shuffle() {
  if (shuffling.value) return
  shuffling.value = true
  try {
    await store.loadMenu(true)
  } catch (error) {
    notify(error.message || '换桌失败，请稍后再试。', 'error')
  } finally {
    shuffling.value = false
  }
}

function reloadPage() {
  location.reload()
}
</script>

<template>
  <div class="page home-page">
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow"><span class="eyebrow-dot"></span>每日食光 · DAILY TABLE</span>
          <h1 class="hero-title">今天，<br><span class="hero-accent">好好吃饭。</span></h1>
          <p class="hero-lede">每天为你搭好一桌菜；登录后按账号保存，刷新也不会变。附上详细做法，也把你会做的那道菜端上来。</p>
          <div class="hero-actions">
            <a v-if="featured" class="btn btn-primary btn-lg" :href="'#/recipe/' + encodeURIComponent(featured.id)">看看今日主菜<AppIcon name="arrow" /></a>
            <a class="btn btn-text" href="#/upload">上传我的拿手菜<AppIcon name="arrowUpRight" /></a>
          </div>
          <div class="hero-stats">
            <div><strong>{{ stats.recipes }}</strong><span>道菜谱</span></div>
            <div><strong>{{ stats.authors }}</strong><span>位厨房朋友</span></div>
            <div><strong>3</strong><span>道每日限定</span></div>
          </div>
          <span class="hero-spark" aria-hidden="true"><AppIcon name="spark" /></span>
        </div>

        <div class="hero-menu">
          <div class="menu-wrap">
            <div class="menu-backdrop" aria-hidden="true"></div>
            <aside class="menu-card" aria-label="今日随机菜单">
              <div class="menu-card-head">
                <div>
                  <span class="menu-kicker">TODAY’S TABLE</span>
                  <h2>今日菜单</h2>
                </div>
                <div class="menu-date">
                  <strong>{{ String(now.getDate()).padStart(2, '0') }}</strong>
                  <div><span>{{ MONTHS_EN[now.getMonth()] }}</span><small>{{ WEEKDAYS[now.getDay()] }}</small></div>
                </div>
              </div>
              <div class="menu-rule" aria-hidden="true"></div>
              <ol class="menu-list">
                <li v-for="(item, index) in menu" :key="item.recipe.id">
                  <a class="menu-item" :href="'#/recipe/' + encodeURIComponent(item.recipe.id)">
                    <span class="menu-index">0{{ index + 1 }}</span>
                    <span class="menu-emoji" :style="{ '--mc1': store.getCategory(item.recipe.category).tone[0], '--mc2': store.getCategory(item.recipe.category).tone[1] }" aria-hidden="true">{{ item.recipe.emoji }}</span>
                    <span class="menu-copy"><span class="menu-role">{{ item.role }}</span><strong>{{ item.recipe.title }}</strong></span>
                    <span class="menu-time">{{ item.recipe.time }}<small>min</small></span>
                    <span class="menu-arrow" aria-hidden="true"><AppIcon name="arrowUpRight" /></span>
                  </a>
                </li>
              </ol>
              <div class="menu-foot">
                <div class="menu-total"><span>整桌约</span><strong>{{ menuTotal }} 分钟</strong></div>
                <button class="menu-shuffle" type="button" :disabled="shuffling" @click="shuffle"><AppIcon name="refresh" /><span>{{ shuffling ? '搭配中…' : '换一桌' }}</span></button>
              </div>
              <span class="menu-stamp" aria-hidden="true">今日<br>新鲜</span>
            </aside>
          </div>
        </div>
      </div>
      <div class="hero-date-note" aria-hidden="true">{{ formatDateLong(now) }} · 刷新不重搭</div>
    </section>

    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <span>好好吃饭</span><i>✳</i><span>慢慢生活</span><i>✳</i><span>分享你的拿手菜</span><i>✳</i><span>每天三道随机灵感</span><i>✳</i>
        <span>好好吃饭</span><i>✳</i><span>慢慢生活</span><i>✳</i><span>分享你的拿手菜</span><i>✳</i><span>每天三道随机灵感</span><i>✳</i>
      </div>
    </div>

    <template v-if="featured">
      <section class="feature-section">
        <div class="container feature-grid">
          <div class="feature-art-wrap">
            <DishArt :recipe="featured" badge="今日主菜" class-name="dish-art--feature" />
            <span class="feature-note">跟着做<br>今晚就能吃上</span>
          </div>
          <div class="feature-copy">
            <span class="eyebrow"><span class="eyebrow-dot"></span>TODAY’S RECIPE · 今日主菜</span>
            <h2 class="feature-title">{{ featured.title }}</h2>
            <p class="feature-desc">{{ featured.description }}</p>
            <div class="feature-meta">
              <span><AppIcon name="clock" />{{ featured.time }} 分钟</span>
              <span><AppIcon name="users" />{{ featured.servings }} 人份</span>
              <span class="difficulty-badge" :class="`is-${featured.difficulty === '进阶' ? 'hard' : featured.difficulty === '中等' ? 'medium' : 'easy'}`">{{ featured.difficulty }}</span>
            </div>
            <div class="feature-details">
              <div class="feature-block">
                <h3><span>01</span>你需要</h3>
                <ul class="mini-ingredients">
                  <li v-for="ing in featureIngredients" :key="ing.name"><span>{{ ing.name }}</span><i></i><strong>{{ ing.amount }}</strong></li>
                </ul>
                <p v-if="remainIngredients" class="mini-more">还有 {{ remainIngredients }} 样食材</p>
              </div>
              <div class="feature-block">
                <h3><span>02</span>开始做</h3>
                <ol class="mini-steps">
                  <li v-for="(step, i) in featureSteps" :key="i"><span>{{ i + 1 }}</span><p>{{ step }}</p></li>
                </ol>
                <p v-if="remainSteps" class="mini-more">还有 {{ remainSteps }} 个步骤</p>
              </div>
            </div>
            <div class="feature-actions">
              <a class="btn btn-primary" :href="'#/recipe/' + encodeURIComponent(featured.id)">查看完整做法<AppIcon name="arrow" /></a>
              <span v-if="author" class="feature-by">
                <span class="author-inline author-inline--muted">
                  <UserAvatar :user="author" size="xs" /><span class="author-name">{{ author.name }}</span>
                  <span v-if="author.verified" class="verified"><AppIcon name="check" /></span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </template>
    <EmptyState v-else emoji="🍽️" title="厨房还在准备中" text="过一会儿再来看看吧。" action-label="刷新一下" @action="reloadPage" />

    <section class="community-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow"><span class="eyebrow-dot"></span>COMMUNITY · 大家的厨房</span>
            <h2>大家端上来的菜</h2>
            <p>来自厨房朋友的真实分享，收藏起来慢慢做。</p>
          </div>
          <a class="btn btn-text" href="#/discover">去发现更多<AppIcon name="arrow" /></a>
        </div>
        <div class="recipe-grid recipe-grid--4">
          <RecipeCard v-for="recipe in community" :key="recipe.id" :recipe="recipe" />
        </div>
        <div class="community-foot">
          <span class="community-foot-mark" aria-hidden="true">✳</span>
          <p>每道被上传的菜，都可能成为某个人今晚的答案。</p>
          <a class="btn btn-ghost" href="#/upload">也端一道上来<AppIcon name="arrowUpRight" /></a>
        </div>
      </div>
    </section>

    <section class="how-section">
      <div class="container how-grid">
        <div class="how-intro">
          <span class="eyebrow eyebrow--light"><span class="eyebrow-dot"></span>HOW IT WORKS · 一起下厨</span>
          <h2>把你的拿手菜，<br>端上桌。</h2>
          <p>不用是专业厨师。一道家常菜，也可能正是别人今晚的灵感。</p>
          <a class="btn btn-accent" href="#/upload">上传我的拿手菜<AppIcon name="arrow" /></a>
        </div>
        <ol class="how-list">
          <li><span class="how-num">01</span><div><h3>建一个厨房身份</h3><p>登录后，你的菜谱会带上名字和一句自我介绍。</p></div></li>
          <li><span class="how-num">02</span><div><h3>写下食材与步骤</h3><p>像讲给朋友听那样，把火候和小窍门都写下来。</p></div></li>
          <li><span class="how-num">03</span><div><h3>等着被收藏</h3><p>别人找到它、收藏它，也许今晚就做它。</p></div></li>
        </ol>
      </div>
    </section>
  </div>
</template>
