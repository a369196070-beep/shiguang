<script setup>
import EmptyState from '../components/EmptyState.vue'
</script>

<template>
  <div class="page">
    <div class="container">
      <EmptyState
        emoji="🍽️"
        kicker="404 · 走错桌了"
        title="这一页不在菜单上"
        text="可能链接写错了，也可能这道菜已经被端走。"
        action-label="回到今日菜单"
        href="#/"
      />
    </div>
  </div>
</template>
