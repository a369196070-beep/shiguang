<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { store } from '../lib/store.js'
import { navigate } from '../lib/router.js'
import { closeConfirm, notify, openAuth, ui } from '../lib/ui.js'
import { difficultyClass } from '../lib/format.js'
import AppIcon from '../components/AppIcon.vue'
import DishArt from '../components/DishArt.vue'
import UserAvatar from '../components/UserAvatar.vue'

const user = computed(() => store.currentUser.value)
const fileInput = ref(null)
const error = ref('')
const errorCard = ref(null)
const formEl = ref(null)
const imageInfo = ref('')
const draftNotice = ref(false)
const draftStatus = ref('草稿会自动保存')
const submitting = ref(false)
const ready = ref(false)
let draftTimer = null

const blank = () => ({
  title: '',
  category: '',
  description: '',
  time: '30',
  servings: '2',
  difficulty: '简单',
  ingredients: [{ name: '', amount: '' }, { name: '', amount: '' }, { name: '', amount: '' }],
  steps: ['', '', ''],
  tags: [],
  tip: '',
  image: null
})

const form = reactive(blank())

const preview = computed(() => ({
  id: 'preview',
  title: form.title || '你的拿手菜',
  emoji: store.getCategory(form.category || '家常菜').emoji,
  category: form.category || '家常菜',
  image: form.image,
  description: form.description || '写一句让人想动筷子的介绍。',
  time: form.time || 30,
  difficulty: form.difficulty || '简单',
  servings: form.servings || 2
}))

const previewTone = computed(() => store.getCategory(form.category || '家常菜').tone)
const submitLabel = computed(() => user.value ? '发布菜谱' : '登录并发布')

watch(error, async (message) => {
  if (!message) return
  await nextTick()
  errorCard.value?.focus()
})

function dismissError() {
  error.value = ''
  nextTick(() => formEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function meaningful(data) {
  return Boolean(
    data.title?.trim() ||
    data.description?.trim() ||
    data.category ||
    data.image ||
    data.tags?.length ||
    data.ingredients?.some((i) => i.name?.trim()) ||
    data.steps?.some((s) => s?.trim())
  )
}

function safeImage(value) {
  return typeof value === 'string' && /^data:image\/(jpeg|png|webp);base64,/.test(value) ? value : null
}

function normalizeDraft(raw) {
  const d = raw && typeof raw === 'object' ? raw : {}
  const ingredients = Array.isArray(d.ingredients) && d.ingredients.length
    ? d.ingredients.slice(0, 20).map((i) => ({ name: String(i.name || ''), amount: String(i.amount || '') }))
    : blank().ingredients
  const steps = Array.isArray(d.steps) && d.steps.length
    ? d.steps.slice(0, 15).map((s) => String(s || ''))
    : blank().steps
  return {
    title: String(d.title || ''),
    category: store.categories.some((c) => c.name === d.category) ? d.category : '',
    description: String(d.description || ''),
    time: d.time != null ? String(d.time) : '30',
    servings: d.servings != null ? String(d.servings) : '2',
    difficulty: store.difficulties.includes(d.difficulty) ? d.difficulty : '简单',
    ingredients,
    steps,
    tags: Array.isArray(d.tags) ? d.tags.filter((t) => store.tags.includes(t)).slice(0, 3) : [],
    tip: String(d.tip || ''),
    image: safeImage(d.image)
  }
}

function applyDraft(data) {
  Object.assign(form, {
    ...blank(),
    ...normalizeDraft(data)
  })
}

function resetForm() {
  Object.assign(form, blank())
  error.value = ''
  imageInfo.value = ''
}

onMounted(() => {
  const draft = store.getDraft()
  const data = normalizeDraft(draft)
  if (meaningful(data)) {
    applyDraft(data)
    draftNotice.value = true
    draftStatus.value = '草稿已恢复'
    imageInfo.value = form.image ? '已恢复上次上传的封面' : ''
  }
  ready.value = true
})

watch(form, () => {
  if (!ready.value) return
  clearTimeout(draftTimer)
  draftStatus.value = '正在保存草稿…'
  draftTimer = setTimeout(() => {
    if (!meaningful(form)) {
      store.clearDraft()
      draftStatus.value = '草稿会自动保存'
      return
    }
    const saved = store.saveDraft(JSON.parse(JSON.stringify(form)))
    draftStatus.value = saved ? '草稿已自动保存' : '草稿保存失败，请检查浏览器空间'
  }, 350)
}, { deep: true })

function clearDraft() {
  store.clearDraft()
  draftNotice.value = false
  resetForm()
  draftStatus.value = '已清空，草稿会自动保存'
}

function discardDraft() {
  ui.confirm = {
    title: '清空这份草稿？',
    message: '已经写下的菜名、食材和步骤都会被清空，且无法恢复。',
    label: '清空重写',
    action: () => {
      clearDraft()
      notify('草稿已清空。', 'info')
      closeConfirm()
    }
  }
}

function pickImage() {
  fileInput.value?.click()
}

function removeImage() {
  form.image = null
  imageInfo.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      reject(new Error('请选择 JPG、PNG 或 WebP 图片。'))
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('图片不能超过 10MB，请换一张小一点的。'))
      return
    }
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      const max = 1200
      const scale = Math.min(1, max / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#f7f2e8'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('这张图片读不出来，请换一张试试。'))
    }
    image.src = url
  })
}

async function onCoverChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  imageInfo.value = '正在压缩图片…'
  try {
    form.image = await compressImage(file)
    const bytes = Math.round((form.image.length * 3) / 4 / 1024)
    imageInfo.value = `已压缩到 ${bytes} KB，发布后会自动保存。`
    error.value = ''
  } catch (err) {
    imageInfo.value = ''
    error.value = err.message
  }
}

function addIngredient() {
  if (form.ingredients.length >= 20) return
  form.ingredients.push({ name: '', amount: '' })
}

function removeIngredient(index) {
  if (form.ingredients.length <= 1) return
  form.ingredients.splice(index, 1)
}

function addStep() {
  if (form.steps.length >= 15) return
  form.steps.push('')
}

function removeStep(index) {
  if (form.steps.length <= 1) return
  form.steps.splice(index, 1)
}

function toggleTag(tag) {
  const index = form.tags.indexOf(tag)
  if (index !== -1) {
    form.tags.splice(index, 1)
    return
  }
  if (form.tags.length >= 3) {
    notify('标签最多选 3 个。', 'info')
    return
  }
  form.tags.push(tag)
}

function validate() {
  if (!form.title.trim()) return '先给这道菜起个名字吧。'
  if (!form.category) return '选一个分类，大家才找得到它。'
  if (form.description.trim().length < 6) return '写一句这道菜的介绍吧（至少 6 个字）。'
  if (form.ingredients.filter((i) => i.name.trim()).length < 2) return '至少填写 2 种食材。'
  if (form.steps.filter((s) => s.trim()).length < 2) return '至少填写 2 个步骤。'
  return ''
}

async function submit() {
  if (submitting.value) return
  error.value = validate()
  if (error.value) return
  if (!user.value) {
    openAuth('login', '登录后会接着发布这道菜，草稿不会丢。', submit)
    return
  }
  submitting.value = true
  const result = await store.addRecipe(form)
  submitting.value = false
  if (!result.ok) {
    error.value = result.error
    return
  }
  clearTimeout(draftTimer)
  store.clearDraft()
  draftNotice.value = false
  draftStatus.value = '已发布，草稿已清空'
  resetForm()
  notify('菜谱已发布，正在端上桌。', 'success')
  navigate('/recipe/' + encodeURIComponent(result.recipe.id))
}
</script>

<template>
  <div class="page upload-page">
    <div class="container">
      <header class="page-head upload-head">
        <div>
          <span class="eyebrow"><span class="eyebrow-dot"></span>SHARE YOUR DISH · 上传菜谱</span>
          <h1>把你会的菜，端上来。</h1>
          <p>不用是专业厨师。一道家常菜，也可能正是别人今晚的灵感。</p>
        </div>
      </header>

      <div v-if="draftNotice" class="draft-notice">
        <AppIcon name="pen" />
        <span>已为你恢复上次未发布的草稿。</span>
        <button class="text-btn" type="button" @click="discardDraft">清空重写</button>
      </div>

      <div class="upload-identity" :class="{ 'is-user': user }">
        <template v-if="user">
          <UserAvatar :user="user" size="sm" />
          <div><strong>以 {{ user.name }} 的身份发布</strong><span>发出去之后，这道菜会带上你的名字。</span></div>
        </template>
        <template v-else>
          <span class="identity-icon"><AppIcon name="lock" /></span>
          <div><strong>你还没有登录</strong><span>可以先写，发布前登录就好。草稿会自动保存在本机。</span></div>
          <button class="btn btn-mini btn-ghost" type="button" @click="openAuth('login', '登录后会接着填写，草稿不会丢。')">去登录</button>
        </template>
      </div>

      <div class="upload-layout">
        <form ref="formEl" class="upload-form" novalidate @submit.prevent="submit">

          <section class="form-card">
            <div class="form-card-head"><span class="form-step">01</span><div><h2>先介绍这道菜</h2><p>菜名、分类和一句让人想动筷子的描述。</p></div></div>
            <div class="form-grid">
              <label class="field field--full">
                <span class="field-label">菜名 <em>必填</em></span>
                <input v-model="form.title" type="text" maxlength="30" placeholder="比如：外婆的红烧肉" autocomplete="off">
              </label>
              <div class="field field--full">
                <span class="field-label">分类 <em>必填</em></span>
                <div class="choice-grid" role="group" aria-label="选择菜谱分类">
                  <label v-for="cat in store.categories" :key="cat.name" class="choice">
                    <input v-model="form.category" type="radio" name="category" :value="cat.name">
                    <span><i aria-hidden="true">{{ cat.emoji }}</i>{{ cat.name }}</span>
                  </label>
                </div>
              </div>
              <label class="field field--full">
                <span class="field-label">一句话介绍 <em>必填</em><small class="field-count">{{ form.description.length }}/160</small></span>
                <textarea v-model="form.description" rows="3" maxlength="160" placeholder="它是什么味道？什么时候最想做来吃？"></textarea>
              </label>
              <label class="field">
                <span class="field-label">烹饪时间</span>
                <span class="unit-input"><input v-model="form.time" type="number" min="1" max="600" inputmode="numeric"><span>分钟</span></span>
              </label>
              <label class="field">
                <span class="field-label">参考份量</span>
                <span class="unit-input"><input v-model="form.servings" type="number" min="1" max="20" inputmode="numeric"><span>人份</span></span>
              </label>
              <div class="field field--full">
                <span class="field-label">难度</span>
                <div class="segmented" role="group" aria-label="选择难度">
                  <label v-for="level in store.difficulties" :key="level">
                    <input v-model="form.difficulty" type="radio" name="difficulty" :value="level"><span>{{ level }}</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section class="form-card">
            <div class="form-card-head"><span class="form-step">02</span><div><h2>让它看起来更好吃</h2><p>上传一张照片，或者跳过，用食光为你配的插画。</p></div></div>
            <div class="cover-upload" :class="{ 'has-image': form.image }" role="button" tabindex="0" aria-label="上传菜谱封面" @click="pickImage" @keydown.enter.prevent="pickImage" @keydown.space.prevent="pickImage">
              <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" hidden @change="onCoverChange">
              <template v-if="form.image">
                <img class="cover-image" :src="form.image" alt="菜谱封面预览">
                <div class="cover-overlay">
                  <span>点击更换照片</span>
                  <button class="cover-remove" type="button" @click.stop="removeImage"><AppIcon name="close" /> 移除</button>
                </div>
              </template>
              <div v-else class="cover-placeholder">
                <AppIcon name="image" />
                <strong>上传这道菜的照片</strong>
                <span>JPG / PNG / WebP，最大 10MB；也可以先跳过</span>
              </div>
            </div>
            <p class="field-hint">{{ imageInfo || '建议使用横图，会自动压缩到合适大小。' }}</p>
          </section>

          <section class="form-card">
            <div class="form-card-head"><span class="form-step">03</span><div><h2>写下食材清单</h2><p>用量可以写“适量”，但别漏掉关键的调味料。</p></div></div>
            <div class="ingredient-rows">
              <div v-for="(ing, i) in form.ingredients" :key="i" class="ingredient-row">
                <span class="row-index">{{ String(i + 1).padStart(2, '0') }}</span>
                <input v-model="ing.name" class="ingredient-name-input" type="text" maxlength="20" placeholder="食材，如 番茄" :aria-label="`食材 ${i + 1} 名称`">
                <input v-model="ing.amount" class="ingredient-amount-input" type="text" maxlength="20" placeholder="用量，如 2 个" :aria-label="`食材 ${i + 1} 用量`">
                <button class="row-remove" type="button" aria-label="删除这条食材" @click="removeIngredient(i)"><AppIcon name="close" /></button>
              </div>
            </div>
            <button class="add-row" type="button" @click="addIngredient"><AppIcon name="plus" /> 添加食材</button>
          </section>

          <section class="form-card">
            <div class="form-card-head"><span class="form-step">04</span><div><h2>像讲给朋友听一样，写下做法</h2><p>把火候、时间和判断标准写清楚，新手也能跟着做。</p></div></div>
            <div class="step-rows">
              <div v-for="(step, i) in form.steps" :key="i" class="step-row">
                <span class="step-num">{{ String(i + 1).padStart(2, '0') }}</span>
                <textarea v-model="form.steps[i]" rows="2" maxlength="320" :placeholder="`第 ${i + 1} 步，比如：番茄切块，鸡蛋打散…`" :aria-label="`步骤 ${i + 1}`"></textarea>
                <button class="row-remove" type="button" aria-label="删除这个步骤" @click="removeStep(i)"><AppIcon name="close" /></button>
              </div>
            </div>
            <button class="add-row" type="button" @click="addStep"><AppIcon name="plus" /> 添加步骤</button>
          </section>

          <section class="form-card">
            <div class="form-card-head"><span class="form-step">05</span><div><h2>最后，加一点个人风格</h2><p>一句小贴士，几个标签，让别人更快找到它。</p></div></div>
            <label class="field">
              <span class="field-label">小贴士 <small>选填</small></span>
              <textarea v-model="form.tip" rows="3" maxlength="200" placeholder="比如：番茄要选熟一点的，汤汁才够浓。"></textarea>
            </label>
            <div class="field">
              <span class="field-label">标签 <small>最多选 3 个 · {{ form.tags.length }}/3</small></span>
              <div class="tag-choices">
                <label v-for="tag in store.tags" :key="tag" class="tag-choice" :class="{ 'is-checked': form.tags.includes(tag) }">
                  <input type="checkbox" :checked="form.tags.includes(tag)" @change="toggleTag(tag)">
                  <span># {{ tag }}</span>
                </label>
              </div>
            </div>
          </section>

          <div class="form-actions">
            <button class="btn btn-accent btn-lg" type="submit" :disabled="submitting">{{ submitting ? '正在端上桌…' : submitLabel }}<AppIcon v-if="!submitting" name="arrow" /></button>
            <span class="draft-status">{{ draftStatus }}</span>
          </div>
        </form>

        <aside class="preview-panel" aria-label="菜谱实时预览">
          <div class="preview-head"><span>LIVE PREVIEW</span><em>实时预览</em></div>
          <div class="preview-card">
            <DishArt :recipe="preview" badge="预览" />
            <div class="preview-body">
              <div class="recipe-meta-line">
                <span>{{ form.category || '待分类' }}</span><span class="meta-sep"></span><span>{{ form.time || 30 }} 分钟</span>
                <span class="difficulty-dot" :class="difficultyClass(form.difficulty)">{{ form.difficulty }}</span>
              </div>
              <h3>{{ form.title || '你的拿手菜' }}</h3>
              <p>{{ form.description || '写一句让人想动筷子的介绍。' }}</p>
              <div class="preview-meta">{{ form.time || 30 }} 分钟 · {{ form.servings || 2 }} 人份</div>
            </div>
          </div>
          <p class="preview-hint">发布后，这道菜会出现在发现页，也能被其他人收藏。</p>
        </aside>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="error" class="upload-error-overlay" @click.self="dismissError">
      <div
        ref="errorCard"
        class="upload-error-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="uploadErrorTitle"
        aria-describedby="uploadErrorMessage"
        tabindex="-1"
        @keydown.esc="dismissError"
      >
        <button class="upload-error-close" type="button" aria-label="关闭提示" @click="dismissError">
          <AppIcon name="close" />
        </button>
        <span class="upload-error-badge"><AppIcon name="alert" /></span>
        <span class="eyebrow"><span class="eyebrow-dot"></span>还差一点</span>
        <h2 id="uploadErrorTitle">先别急着发布</h2>
        <p id="uploadErrorMessage">{{ error }}</p>
        <button class="btn btn-accent btn-block" type="button" @click="dismissError">知道了，去补充</button>
      </div>
    </div>
  </Teleport>
</template>
