import client from './client'
import type { User } from '@/stores/auth'
import type { Post, CreatePostPayload } from '@/stores/posts'
import type { CommunityStats, CommunityInfo } from '@/stores/community'

// ─── Auth ─────────────────────────────────────────────────────
export const authApi = {

  // POST /auth/login → { token, user }
  login: (payload: { email: string; password: string; communityId: string }) =>
    client.post<{ token: string; user: User }>('/auth/login', payload),

  // GET /auth/me → user ปัจจุบัน (ใช้ token จาก interceptor)
  me: () =>
    client.get<User>('/auth/me'),

  // POST /auth/logout
  logout: () =>
    client.post('/auth/logout'),
}

// ─── Posts ────────────────────────────────────────────────────
export const postsApi = {

  // GET /posts?communityId=xxx&category=xxx&tag=xxx
  getAll: (params?: {
    communityId?: string
    category?:    string
    tag?:         string
    page?:        number
    limit?:       number
  }) => client.get<{ data: Post[]; total: number }>('/posts', { params }),

  // GET /posts/:id
  getById: (id: number) =>
    client.get<Post>(`/posts/${id}`),

  // POST /posts
  create: (payload: CreatePostPayload & { communityId: string }) =>
    client.post<Post>('/posts', payload),

  // PUT /posts/:id
  update: (id: number, payload: Partial<CreatePostPayload>) =>
    client.put<Post>(`/posts/${id}`, payload),

  // DELETE /posts/:id
  delete: (id: number) =>
    client.delete(`/posts/${id}`),
}

// ─── Community ────────────────────────────────────────────────
export const communityApi = {

  // GET /community/:id
  getInfo: (communityId: string) =>
    client.get<CommunityInfo>(`/community/${communityId}`),

  // GET /community/:id/stats
  getStats: (communityId: string) =>
    client.get<CommunityStats>(`/community/${communityId}/stats`),

  // GET /community (ใช้บนหน้า noda.com แสดงรายการทุกชุมชน)
  getAll: () =>
    client.get<CommunityInfo[]>('/community'),
}
