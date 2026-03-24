<template>
  <div class="panel-card">
    <div class="panel-title">🌐 ชุมชนเครือข่าย</div>

    <div v-if="isLoading" class="loading-list">
      <div v-for="n in 3" :key="n" class="skeleton-row" />
    </div>

    <template v-else>
      <button
        v-for="c in otherCommunities"
        :key="c.id"
        class="community-item"
        :disabled="navigating === c.id"
        @click="goToCommunity(c)"
      >
        <div class="community-avatar" :style="{ background: avatarColor(c.id) }">
          {{ c.name.slice(0, 2) }}
        </div>
        <div class="community-info">
          <div class="community-name">{{ c.name }}</div>
          <div class="community-url">{{ c.url }}</div>
        </div>
        <span class="community-arrow">{{ navigating === c.id ? '...' : '↗' }}</span>
      </button>

      <div class="panel-footer">
        <span>{{ otherCommunities.length }} ชุมชนเชื่อมต่อ</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import client from '@/api/client'

interface Community {
  id:          string
  name:        string
  url:         string
  postCount:   number
  memberCount: number
}

const authStore   = useAuthStore()
const communities = ref<Community[]>([])
const isLoading   = ref(false)
const navigating  = ref<string | null>(null)

const otherCommunities = computed(() =>
  communities.value.filter(c => c.id !== authStore.communityId)
)

const colors = ['#2D5A1B', '#3B72C2', '#5E3AAA', '#A84E10', '#7A4520', '#0F6E56']
const avatarColor = (id: string) => colors[id.charCodeAt(0) % colors.length]

async function fetchCommunities() {
  isLoading.value = true
  try {
    const res = await client.get<Community[]>('/community/all')
    communities.value = res.data
  } finally {
    isLoading.value = false
  }
}

async function goToCommunity(target: Community) {
  if (navigating.value) return
  navigating.value = target.id
  try {
    const res = await client.post<{ token: string }>('/auth/handoff-token')
    const url = new URL('/auth/handoff', target.url)
    url.searchParams.set('token',       res.data.token)
    url.searchParams.set('communityId', target.id)
    window.location.href = url.toString()
  } catch {
    navigating.value = null
    alert('ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่')
  }
}

onMounted(fetchCommunities)
</script>

<style scoped>
.panel-card {
  background: #fff; border-radius: 10px;
  padding: 16px; border: 1px solid #E5D9C5;
}
.panel-title {
  font-size: 13px; font-weight: 600;
  color: var(--brown-800); margin-bottom: 12px;
}
.loading-list  { display:flex; flex-direction:column; gap:8px; }
.skeleton-row  { height:52px; border-radius:8px; background:linear-gradient(90deg,#F0E8D8 25%,#F8F2E8 50%,#F0E8D8 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
@keyframes shimmer { to { background-position:-200% 0; } }

.community-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px; border-radius: 8px; width: 100%;
  text-align: left; background: none; border: 1px solid transparent;
  cursor: pointer; transition: background 0.15s; margin-bottom: 4px;
}
.community-item:hover:not(:disabled) { background: var(--cream); border-color: #E0D0B8; }
.community-item:disabled { opacity: 0.6; cursor: wait; }
.community-avatar {
  width: 36px; height: 36px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
}
.community-info { flex: 1; min-width: 0; }
.community-name { font-size: 13px; font-weight: 600; color: var(--brown-900); }
.community-url  { font-size: 11px; color: var(--brown-400); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.community-arrow { font-size: 13px; color: var(--brown-400); flex-shrink: 0; }
.community-item:hover:not(:disabled) .community-arrow { color: var(--green-dark); }

.panel-footer {
  margin-top: 10px; padding-top: 10px;
  border-top: 1px solid #F0E8D8;
  font-size: 11.5px; color: var(--brown-400);
  text-align: center;
}
</style>
