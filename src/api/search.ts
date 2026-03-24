import client from './client'

export type SearchScope = 'home' | 'knowledge' | 'announcements' | 'members' | 'all'

export interface SearchParams {
  q:           string
  scope:       SearchScope
  communityId: string
  page?:       number
  limit?:      number
}

// ─── Frontend เรียก GET /search ───────────────────────────────
// scope มาจาก route.name โดยตรง — backend กรองให้ถูกต้องเอง
export const searchApi = {
  search: (params: SearchParams) =>
    client.get('/search', { params }),
}
