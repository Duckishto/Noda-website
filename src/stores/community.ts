import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface CommunityStats {
  postCount:            number
  memberCount:          number
  wordCount:            number
  connectedCommunities: number
}

export interface CommunityInfo {
  id:          string
  name:        string
  domain:      string
  description: string
}

export const useCommunityStore = defineStore('community', () => {

  // ─── State ────────────────────────────────────────────────
  const stats     = ref<CommunityStats | null>(null)
  const info      = ref<CommunityInfo | null>(null)
  const isLoading = ref(false)

  // ─── Actions ──────────────────────────────────────────────

  // ดึงสถิติ + ข้อมูลชุมชน พร้อมกัน
  async function fetchCommunity() {
    const auth = useAuthStore()
    if (!auth.communityId) return

    isLoading.value = true
    try {
      const [statsRes, infoRes] = await Promise.all([
        axios.get(`${API}/community/${auth.communityId}/stats`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        }),
        axios.get(`${API}/community/${auth.communityId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        }),
      ])
      stats.value = statsRes.data
      info.value  = infoRes.data
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats,
    info,
    isLoading,
    fetchCommunity,
  }
})
