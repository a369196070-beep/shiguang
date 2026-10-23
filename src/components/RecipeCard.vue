<script setup>
import { computed } from 'vue'
import { store } from '../lib/store.js'
import { difficultyClass, recipeTime } from '../lib/format.js'
import { handleFavorite, requestDelete } from '../lib/ui.js'
import { route } from '../lib/router.js'
import AppIcon from './AppIcon.vue'
import DishArt from './DishArt.vue'
import UserAvatar from './UserAvatar.vue'

const props = defineProps({
  recipe: { type: Object, required: true },
  manage: Boolean
})

const author = computed(() => store.getAuthor(props.recipe))
const favorite = computed(() => store.isFavorite(props.recipe.id))
const href = computed(() => '#/recipe/' + encodeURIComponent(props.recipe.id))
const difficulty = computed(() => difficultyClass(props.recipe.difficulty))

function remove() {
  requestDelete(props.recipe, () => {
    if (route.name === 'recipe') location.hash = '#/mine'
  })
}
</script>

<template>
  <article class="recipe-card">
    <div class="recipe-card-art">
      <a class="recipe-art-link" :href="href" :aria-label="`查看菜谱：${recipe.title}`">
        <DishArt :recipe="recipe" />
      </a>
      <button
        class="fav-btn fav-btn--card"
        :class="{ 'is-active': favorite }"
        type="button"
        :aria-label="favorite ? `取消收藏${recipe.title}` : `收藏${recipe.title}`"
        :aria-pressed="favorite"
        @click="handleFavorite(recipe.id)"
      >
        <AppIcon name="heart" />
      </button>
    </div>

    <div class="recipe-card-body">
      <p class="recipe-meta-line">
        <span>{{ recipe.category }}</span>
        <span aria-hidden="true">·</span>
        <span>{{ recipeTime(recipe.time) }}</span>
        <span class="difficulty-dot" :class="difficulty">{{ recipe.difficulty }}</span>
      </p>
      <h3 class="recipe-card-title"><a :href="href">{{ recipe.title }}</a></h3>
      <p class="recipe-card-desc">{{ recipe.description }}</p>
      <div class="recipe-card-foot">
        <span v-if="author" class="author-inline">
          <UserAvatar :user="author" size="xs" />
          <span class="author-name">{{ author.name }}</span>
          <span v-if="author.verified" class="verified" title="官方账号"><AppIcon name="check" /></span>
        </span>
        <button v-if="manage" class="card-manage" type="button" @click="remove">
          <AppIcon name="trash" /><span>删除</span>
        </button>
        <span v-else class="card-time"><AppIcon name="clock" />{{ recipeTime(recipe.time) }}</span>
      </div>
    </div>
  </article>
</template>
