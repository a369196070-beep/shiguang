import { createApp } from 'vue'
import App from './App.vue'
import { store } from './lib/store.js'
import './styles.css'

store.init().finally(() => {
  createApp(App).mount('#app')
})
