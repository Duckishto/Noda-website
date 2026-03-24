import { defineStore } from 'pinia'
import { ref } from 'vue'
import client from '@/api/client'

export interface Announcement {
  id:         number
  title:      string
  body:       string
  type:       'general' | 'event' | 'urgent'
  authorName: string
  createdAt:  string
  eventDate?: string | null
}

export const useAnnouncementsStore = defineStore('announcements', () => {

  const announcements = ref<Announcement[]>([])
  const isLoading     = ref(false)
  const error         = ref<string | null>(null)

  async function fetchAnnouncements() {
    isLoading.value = true
    error.value     = null
    try {
      const res = await client.get<Announcement[]>('/announcements')
      announcements.value = res.data
    } catch (e: any) {
      error.value = e?.response?.data?.message || 'โหลดประกาศไม่สำเร็จ'
    } finally {
      isLoading.value = false
    }
  }

  async function createAnnouncement(payload: {
    title: string; body: string; type: string; eventDate?: string
  }) {
    const res = await client.post<Announcement>('/announcements', payload)
    announcements.value.unshift(res.data)
    return res.data
  }

  async function deleteAnnouncement(id: number) {
    await client.delete(`/announcements/${id}`)
    announcements.value = announcements.value.filter(a => a.id !== id)
  }

  return { announcements, isLoading, error, fetchAnnouncements, createAnnouncement, deleteAnnouncement }
})
