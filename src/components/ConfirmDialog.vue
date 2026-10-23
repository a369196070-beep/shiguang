<script setup>
import { ref, watch } from 'vue'
import { closeConfirm, confirmAction, ui } from '../lib/ui.js'
import AppIcon from './AppIcon.vue'

const dialog = ref(null)

watch(() => ui.confirm, async (value) => {
  if (value) {
    await Promise.resolve()
    if (dialog.value && !dialog.value.open) dialog.value.showModal()
  } else if (dialog.value?.open) {
    dialog.value.close()
  }
})

function cancel() {
  if (dialog.value?.open) dialog.value.close()
  closeConfirm()
}
</script>

<template>
  <dialog id="confirmDialog" ref="dialog" class="modal confirm-dialog" aria-labelledby="confirmTitle" @cancel.prevent="cancel" @click.self="cancel">
    <div class="confirm-icon" aria-hidden="true"><AppIcon name="trash" /></div>
    <h2 id="confirmTitle">{{ ui.confirm?.title || '确认操作' }}</h2>
    <p>{{ ui.confirm?.message }}</p>
    <div class="confirm-actions">
      <button class="btn btn-ghost" type="button" @click="cancel">再想想</button>
      <button class="btn btn-danger" type="button" @click="confirmAction">{{ ui.confirm?.label || '确认' }}</button>
    </div>
  </dialog>
</template>
