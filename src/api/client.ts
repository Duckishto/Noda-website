import axios from 'axios'
import type { AxiosInstance } from 'axios'

const client: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request: แนบ JWT + communityId ทุก request ──────────────
client.interceptors.request.use((config) => {
  const token       = localStorage.getItem('noda_token')
  const communityId = import.meta.env.VITE_COMMUNITY_ID

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Multi-tenant: บอก backend ว่า request นี้มาจากชุมชนไหน
  if (communityId) {
    config.headers['x-community-id'] = communityId
  }

  return config
})

// ─── Response: จัดการ 401 อัตโนมัติ ─────────────────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token หมดอายุ → ล้าง token แล้วกลับหน้า login
      localStorage.removeItem('noda_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
