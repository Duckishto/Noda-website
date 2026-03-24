// ─── User & Auth ─────────────────────────────────────────────
export interface User {
  id:          number
  name:        string
  email:       string
  role:        'admin' | 'user'
  communityId: string
}

export interface LoginPayload {
  email:       string
  password:    string
  communityId: string
}

export interface LoginResponse {
  token: string
  user:  User
}

// ─── Community ───────────────────────────────────────────────
export interface CommunityInfo {
  id:          string
  name:        string
  domain:      string
  description: string
}

export interface CommunityStats {
  postCount:            number
  memberCount:          number
  wordCount:            number
  connectedCommunities: number
}

// ─── Post ────────────────────────────────────────────────────
export type PostTemplate = 'dictionary' | 'map' | 'story' | 'audio'
export type PostCategory =
  | 'language'
  | 'wisdom'
  | 'story'
  | 'cultural_map'
  | 'food'
  | 'ritual'

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

// ─── API Response ────────────────────────────────────────────
export interface ApiResponse<T> {
  data:    T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data:  T[]
  total: number
  page:  number
  limit: number
}
