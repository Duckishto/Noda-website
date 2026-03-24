import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  communityId: string
}

export const useAuthStore = defineStore('auth', () => {

  // ─── State ────────────────────────────────────────────────
  const user  = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('noda_token'))

  // ─── Getters ──────────────────────────────────────────────
  const isLoggedIn  = computed(() => !!token.value && !!user.value)
  const isAdmin     = computed(() => user.value?.role === 'admin')
  const communityId = computed(
    () => user.value?.communityId ?? import.meta.env.VITE_COMMUNITY_ID ?? ''
  )

  // ─── Actions ──────────────────────────────────────────────

  // Login → รับ JWT จาก backend แล้วเก็บลง localStorage
  async function login(payload: { email: string; password: string; communityId: string }) {
    const res = await axios.post(`${API}/auth/login`, payload)
    const { token: jwt, user: userData } = res.data

    token.value = jwt
    user.value  = userData
    localStorage.setItem('noda_token', jwt)
  }

  // ดึงข้อมูล user จาก token ที่มีอยู่ (ใช้ตอน refresh หน้า)
  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = res.data
    } catch {
      // token หมดอายุหรือไม่ถูกต้อง → logout
      logout()
    }
  }

  // Logout → ล้างทุกอย่าง
  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem('noda_token')
  }

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    communityId,
    login,
    fetchMe,
    logout,
  }
})
