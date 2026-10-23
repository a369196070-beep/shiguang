<script setup>
import { computed, ref, watch } from 'vue'
import { store } from '../lib/store.js'
import { navigate } from '../lib/router.js'
import { handleFavorite, notify, requestDelete } from '../lib/ui.js'
import { formatDateShort, relativeDate } from '../lib/format.js'
import AppIcon from '../components/AppIcon.vue'
import DishArt from '../components/DishArt.vue'
import RecipeCard from '../components/RecipeCard.vue'
import UserAvatar from '../components/UserAvatar.vue'

const props = defineProps({ id: { type: String, required: true } })

const checked = ref(new Set())
const recipe = computed(() => store.getRecipe(props.id))
const author = computed(() => recipe.value ? store.getAuthor(recipe.value) : null)
const category = computed(() => recipe.value ? store.getCategory(recipe.value.category) : null)
const user = computed(() => store.currentUser.value)
const own = computed(() => Boolean(user.value && author.value && author.value.id === user.value.id))
const favorite = computed(() => recipe.value ? store.isFavorite(recipe.value.id) : false)
const related = computed(() => recipe.value ? store.relatedRecipes(recipe.value, 3) : [])
const hotText = computed(() => {
  if (!recipe.value) return ''
  return recipe.value.crowd > 0 ? `${recipe.value.crowd} 人收藏过` : '刚刚端上桌 · 来做第一个收藏的人'
})

watch(() => props.id, () => { checked.value = new Set() })

function toggle(index) {
  const next = new Set(checked.value)
  if (next.has(index)) next.delete(index)
  else next.add(index)
  checked.value = next
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href)
    notify('链接已复制，去分享给朋友吧。', 'success')
  } catch {
    window.prompt('复制这个链接分享给朋友：', location.href)
  }
}

function remove() {
  if (!recipe.value) return
  requestDelete(recipe.value, () => navigate('/mine'))
}
</script>

<template>
  <div v-if="!recipe" class="page notfound-page">
    <div class="container notfound">
      <span class="notfound-emoji" aria-hidden="true">🥢</span>
      <span class="eyebrow"><span class="eyebrow-dot"></span>404 · LOST IN THE KITCHEN</span>
      <h1>这道菜被端走了。</h1>
      <p>可能链接写错了，也可能它已经回到厨房里。去别处找找今晚的灵感吧。</p>
      <a class="btn btn-primary" href="#/">回到今日菜单<AppIcon name="arrow" /></a>
    </div>
  </div>

  <div v-else class="page recipe-page">
    <div class="container">
      <div class="recipe-topbar">
        <a class="back-link" href="#/discover"><AppIcon name="arrow" flip />返回发现</a>
        <span class="recipe-topbar-meta">{{ recipe.category }} · {{ formatDateShort(recipe.createdAt) }}</span>
      </div>

      <article class="recipe-detail">
        <div class="recipe-detail-art">
          <DishArt :recipe="recipe" class-name="dish-art--detail" :badge="own ? '你的菜谱' : ''" />
          <div class="recipe-art-caption">
            <span><AppIcon name="spark" />{{ hotText }}</span>
            <span>{{ recipe.difficulty }}</span>
          </div>
        </div>

        <div class="recipe-detail-copy">
          <div class="recipe-detail-kicker">
            <span class="category-chip category-chip--plain">{{ category.emoji }} {{ recipe.category }}</span>
            <span class="dot-sep"></span>
            <span>{{ relativeDate(recipe.createdAt) }}更新</span>
          </div>
          <h1>{{ recipe.title }}</h1>
          <p class="recipe-lead">{{ recipe.description }}</p>

          <div class="recipe-facts">
            <div><span class="fact-icon"><AppIcon name="clock" /></span><div><strong>{{ recipe.time }} 分钟</strong><small>烹饪时间</small></div></div>
            <div><span class="fact-icon"><AppIcon name="users" /></span><div><strong>{{ recipe.servings }} 人份</strong><small>参考份量</small></div></div>
            <div><span class="fact-icon"><AppIcon name="bowl" /></span><div><strong>{{ recipe.difficulty }}</strong><small>难度</small></div></div>
          </div>

          <div v-if="recipe.tags.length" class="tag-row">
            <span v-for="tag in recipe.tags" :key="tag" class="tag"># {{ tag }}</span>
          </div>

          <div class="recipe-actions">
            <button class="btn btn-accent btn-favorite" :class="{ 'is-active': favorite }" type="button" :aria-pressed="favorite" @click="handleFavorite(recipe.id)">
              <AppIcon name="heart" /><span>{{ favorite ? '已收藏' : '收藏这道菜' }}</span>
            </button>
            <button class="btn btn-ghost" type="button" @click="copyLink"><AppIcon name="share" /><span>分享链接</span></button>
            <button v-if="own" class="text-btn text-btn--danger" type="button" @click="remove"><AppIcon name="trash" />删除</button>
          </div>

          <div v-if="author" class="recipe-author">
            <UserAvatar :user="author" size="md" />
            <div class="recipe-author-copy">
              <div class="recipe-author-name">
                {{ author.name }}<span v-if="author.verified" class="verified"><AppIcon name="check" /></span>
                <span>{{ own ? '这是你' : '厨房朋友' }}</span>
              </div>
              <p>{{ author.bio || '正在认真吃饭。' }}</p>
            </div>
          </div>
        </div>
      </article>

      <div class="recipe-body">
        <aside class="ingredients-panel">
          <div class="panel-head">
            <h2>食材清单</h2>
            <span>{{ recipe.servings }} 人份</span>
          </div>
          <ul class="ingredient-list">
            <li v-for="(ing, i) in recipe.ingredients" :key="`${ing.name}-${i}`">
              <label class="ingredient-item">
                <input type="checkbox" :checked="checked.has(i)" :aria-label="ing.name" @change="toggle(i)">
                <span class="check-box" aria-hidden="true"><AppIcon name="check" /></span>
                <span class="ingredient-name">{{ ing.name }}</span>
                <span class="ingredient-dots" aria-hidden="true"></span>
                <span class="ingredient-amount">{{ ing.amount }}</span>
              </label>
            </li>
          </ul>
          <p class="panel-hint"><AppIcon name="spark" /> 点击食材可以打勾，采购时不容易漏。</p>
        </aside>

        <section class="steps-panel">
          <div class="panel-head">
            <h2>做法步骤</h2>
            <span>{{ recipe.steps.length }} 步</span>
          </div>
          <ol class="step-list">
            <li v-for="(step, i) in recipe.steps" :key="i" class="step-item">
              <span class="step-number">{{ String(i + 1).padStart(2, '0') }}</span>
              <p>{{ step }}</p>
            </li>
          </ol>
          <div v-if="recipe.tip" class="tip-card">
            <span class="tip-label"><AppIcon name="spark" /> 小贴士</span>
            <p>{{ recipe.tip }}</p>
          </div>
        </section>
      </div>

      <section v-if="related.length" class="related-section">
        <div class="section-head section-head--compact">
          <div>
            <span class="eyebrow"><span class="eyebrow-dot"></span>MORE TO COOK</span>
            <h2>再试试这几道</h2>
          </div>
          <a class="btn btn-text" href="#/discover">全部菜谱<AppIcon name="arrow" /></a>
        </div>
        <div class="recipe-grid recipe-grid--3">
          <RecipeCard v-for="item in related" :key="item.id" :recipe="item" />
        </div>
      </section>
    </div>
  </div>
</template>
