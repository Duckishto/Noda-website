import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export type PostTemplate = 'dictionary' | 'map' | 'story' | 'audio'
export type PostCategory = 'language' | 'wisdom' | 'story' | 'cultural_map' | 'food' | 'ritual'

export interface Post {
  id:          number
  title:       string
  template:    PostTemplate
  category:    PostCategory
  tags:        string[]
  authorId:    number
  authorName:  string
  communityId: string
  createdAt:   string
  viewCount:   number
}

export interface CreatePostPayload {
  title:         string
  template:      PostTemplate
  category:      PostCategory
  tags:          string[]
  languageGroup: string
  communityId:   string
}

export const usePostsStore = defineStore('posts', () => {

  // ─── State ───────────────────────────────────────
  const posts       = ref<Post[]>([])
  const total       = ref(0)
  const isLoading   = ref(false)
  const isFetched   = ref(false)   // ← กันเรียกซ้ำเมื่อ navigate กลับมา
  const activeTag      = ref('all')
  const activeCategory = ref<PostCategory | 'all'>('all')

  // ─── Getters ─────────────────────────────────────
  const filteredPosts = computed(() => {
    let result = posts.value
    if (activeCategory.value !== 'all') {
      result = result.filter(p => p.category === activeCategory.value)
    }
    if (activeTag.value !== 'all') {
      result = result.filter(p => p.tags.includes(activeTag.value))
    }
    return result
  })

  // ─── Actions ─────────────────────────────────────

  // fetchPosts — ไม่โหลดซ้ำถ้ามีข้อมูลแล้ว (ป้องกัน layout กระโดด)
  async function fetchPosts(force = false) {
    if (isFetched.value && !force) return   // ← มีแล้ว ข้ามได้เลย

    const auth = useAuthStore()
    isLoading.value = true
    try {
      const res = await axios.get(`${API}/posts`, {
        headers: { Authorization: `Bearer ${auth.token}` },
        params:  { communityId: auth.communityId },
      })
      posts.value   = res.data.data
      total.value   = res.data.total
      isFetched.value = true
    } catch {
      // ถ้า API ยังไม่มี ใช้ mock data ชั่วคราว
      posts.value = []
      total.value = 0
      isFetched.value = true   // ← mark ว่าพยายามแล้ว ไม่วนซ้ำ
    } finally {
      isLoading.value = false
    }
  }

  async function createPost(payload: CreatePostPayload) {
    const auth = useAuthStore()
    const res = await axios.post(
      `${API}/posts`,
      { ...payload, communityId: auth.communityId },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    )
    posts.value.unshift(res.data)
    total.value++
    return res.data as Post
  }

  async function deletePost(id: number) {
    const auth = useAuthStore()
    await axios.delete(`${API}/posts/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    posts.value = posts.value.filter(p => p.id !== id)
    total.value--
  }

  function setTag(tag: string)                    { activeTag.value = tag }
  function setCategory(cat: PostCategory | 'all') { activeCategory.value = cat }

  // force refresh — ใช้หลัง createPost เพื่อซิงค์กับ backend
  function refresh() { return fetchPosts(true) }

  return {
    posts, total, isLoading, isFetched,
    activeTag, activeCategory, filteredPosts,
    fetchPosts, createPost, deletePost,
    setTag, setCategory, refresh,
  }
})
