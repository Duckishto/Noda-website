import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// ─── Multi-tenant: อ่าน COMMUNITY_ID จาก .env ───────────────
// แต่ละชุมชนมี .env ของตัวเอง เช่น
//   comA.com → VITE_COMMUNITY_ID=community-a
//   comB.com → VITE_COMMUNITY_ID=community-b
//   noda.com → VITE_COMMUNITY_ID=noda-central
const communityId = import.meta.env.VITE_COMMUNITY_ID
if (!communityId) {
  console.warn('[Noda] VITE_COMMUNITY_ID ไม่ได้ตั้งค่าใน .env')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
