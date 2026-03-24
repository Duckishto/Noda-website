<template>
  <div class="handoff-page">
    <div class="handoff-card">
      <div class="logo-text">Noda</div>

      <div v-if="status === 'loading'" class="status-loading">
        <div class="spinner" />
        <p>กำลังเชื่อมต่อ...</p>
      </div>

      <div v-else-if="status === 'success'" class="status-success">
        <div class="check">✓</div>
        <p>เข้าสู่ระบบสำเร็จ กำลังนำไปหน้าแรก...</p>
      </div>

      <div v-else class="status-error">
        <p class="error-msg">{{ errorMessage }}</p>
        <router-link to="/login" class="btn-login">เข้าสู่ระบบใหม่</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router    = useRouter()
const authStore = useAuthStore()

const status       = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('')

const API         = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const communityId = import.meta.env.VITE_COMMUNITY_ID as string

onMounted(async () => {
  const params      = new URLSearchParams(window.location.search)
  const token       = params.get('token')

  if (!token || !communityId) {
    status.value       = 'error'
    errorMessage.value = 'ไม่พบ token หรือ communityId'
    return
  }

  try {
    // แลก one-time token → JWT ของชุมชนนี้
    const res = await axios.post(`${API}/auth/verify-handoff`, { token, communityId })
    const { token: jwt, user } = res.data

    // เก็บ JWT เหมือน login ปกติ
    authStore.token = jwt
    authStore.user  = user
    localStorage.setItem('noda_token', jwt)

    status.value = 'success'

    // นำไปหน้าแรกหลังจาก 800ms
    setTimeout(() => router.replace('/'), 800)
  } catch (e: any) {
    status.value       = 'error'
    errorMessage.value = e?.response?.data?.message || 'Token ไม่ถูกต้องหรือหมดอายุแล้ว'
  }
})
</script>

<style scoped>
.handoff-page {
  min-height: 100vh; background: var(--brown-900);
  display: flex; align-items: center; justify-content: center;
}
.handoff-card {
  background: var(--brown-50); border-radius: 16px;
  padding: 48px 40px; text-align: center;
  width: 100%; max-width: 340px; border: 1px solid #E0D0B8;
}
.logo-text { font-size: 32px; font-weight: 700; color: var(--green-dark); font-family: 'Noto Serif Thai', serif; margin-bottom: 28px; }

.status-loading, .status-success, .status-error { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.spinner {
  width: 36px; height: 36px; border: 3px solid #E5D9C5;
  border-top-color: var(--green-dark); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.check { font-size: 36px; color: var(--green-dark); }
.status-loading p, .status-success p { font-size: 14px; color: var(--brown-600); }

.error-msg { font-size: 13px; color: var(--tag-orange); background: var(--tag-orange-bg); padding: 10px 16px; border-radius: 8px; }
.btn-login {
  display: inline-block; padding: 10px 24px; border-radius: 8px;
  background: var(--green-dark); color: #fff; font-size: 13px;
  font-weight: 600; text-decoration: none;
}
</style>
