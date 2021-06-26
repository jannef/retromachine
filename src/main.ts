import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { key, loadState } from '@/store'

createApp(App).use(loadState(), key).use(router).mount('#app')
