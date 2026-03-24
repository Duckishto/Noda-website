<template>
  <div>
    <!-- Stats -->
    <div class="member-stats">
      <div class="stat-pill"><span class="stat-num">{{ total }}</span><span class="stat-label">สมาชิกทั้งหมด</span></div>
      <div class="stat-pill"><span class="stat-num">{{ adminCount }}</span><span class="stat-label">ผู้ดูแล</span></div>
      <div class="stat-pill"><span class="stat-num">{{ userCount }}</span><span class="stat-label">สมาชิกทั่วไป</span></div>
    </div>

    <!-- Search + filter -->
    <div class="search-row">
      <div class="search-box">
        <span class="s-icon">🔍</span>
        <input v-model="searchQuery" class="s-input" type="text" placeholder="ค้นหาชื่อหรืออีเมล..." @input="onSearch" />
        <button v-if="searchQuery" class="s-clear" @click="clearSearch">✕</button>
      </div>
      <div class="role-filter">
        <button class="role-btn" :class="{ active: roleFilter === 'all' }"   @click="roleFilter = 'all'">ทั้งหมด</button>
        <button class="role-btn" :class="{ active: roleFilter === 'admin' }" @click="roleFilter = 'admin'">Admin</button>
        <button class="role-btn" :class="{ active: roleFilter === 'user' }"  @click="roleFilter = 'user'">User</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="members-grid">
      <div v-for="n in 6" :key="n" class="skeleton-member" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-banner">{{ error }}</div>

    <!-- Empty search -->
    <EmptyState v-else-if="filtered.length === 0 && searchQuery" type="members" />

    <!-- Grid -->
    <div v-else class="members-grid">
      <div v-for="member in filtered" :key="member.id" class="member-card">
        <div class="member-avatar" :style="{ background: avatarColor(member.id) }">{{ member.name.slice(0,2) }}</div>
        <div class="member-info">
          <div class="member-name">{{ member.name }}</div>
          <div class="member-email">{{ member.email }}</div>
        </div>
        <span class="role-badge" :class="member.role === 'admin' ? 'badge-admin' : 'badge-user'">
          {{ member.role === 'admin' ? 'Admin' : 'User' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import client from '@/api/client'
import EmptyState from '@/components/EmptyState.vue'

interface Member {
  id:       number
  name:     string
  email:    string
  role:     'admin' | 'user'
  joinedAt: string
}

const members     = ref<Member[]>([])
const isLoading   = ref(false)
const error       = ref<string | null>(null)
const searchQuery = ref('')
const roleFilter  = ref('all')

// ─── computed ─────────────────────────────────────
const filtered = computed(() =>
  members.value.filter(m => {
    const matchRole = roleFilter.value === 'all' || m.role === roleFilter.value
    return matchRole
  })
)
const total      = computed(() => members.value.length)
const adminCount = computed(() => members.value.filter(m => m.role === 'admin').length)
const userCount  = computed(() => members.value.filter(m => m.role === 'user').length)

// ─── fetch (รองรับ search ผ่าน query param ?q=) ──
async function fetchMembers(q = '') {
  isLoading.value = true
  error.value     = null
  try {
    const res = await client.get<Member[]>('/members', { params: q ? { q } : {} })
    members.value = res.data
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'โหลดสมาชิกไม่สำเร็จ'
  } finally {
    isLoading.value = false
  }
}

let searchTimer: ReturnType<typeof setTimeout>
function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => fetchMembers(searchQuery.value), 350)
}
function clearSearch() {
  searchQuery.value = ''
  fetchMembers()
}

const colors = ['#4A7C2F','#3B72C2','#5E3AAA','#A84E10','#7A4520']
const avatarColor = (id: number) => colors[id % colors.length]

onMounted(() => fetchMembers())
</script>

<style scoped>
.member-stats { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
.stat-pill    { background:#fff; border-radius:10px; border:1px solid #E5D9C5; padding:12px 20px; display:flex; flex-direction:column; align-items:center; gap:2px; flex:1; min-width:80px; }
.stat-num     { font-size:22px; font-weight:700; color:var(--brown-900); line-height:1; }
.stat-label   { font-size:11.5px; color:var(--brown-500); }

.search-row   { display:flex; gap:12px; margin-bottom:18px; flex-wrap:wrap; align-items:center; }
.search-box   { display:flex; align-items:center; gap:8px; background:#fff; border:1px solid #D8C9B0; border-radius:9px; padding:8px 12px; flex:1; min-width:200px; transition:border 0.15s; }
.search-box:focus-within { border-color:var(--green-mid); }
.s-icon  { font-size:14px; flex-shrink:0; }
.s-input { flex:1; border:none; background:none; font-size:13px; font-family:'Sarabun',sans-serif; color:var(--brown-900); outline:none; }
.s-input::placeholder { color:var(--brown-400); }
.s-clear { background:none; border:none; font-size:12px; color:var(--brown-400); cursor:pointer; padding:0 2px; }

.role-filter { display:flex; gap:4px; background:#fff; border:1px solid #E5D9C5; border-radius:9px; padding:4px; }
.role-btn    { padding:5px 12px; border-radius:6px; border:none; background:none; font-size:12px; font-family:'Sarabun',sans-serif; color:var(--brown-500); cursor:pointer; transition:all 0.15s; }
.role-btn.active { background:var(--green-dark); color:#fff; }

.skeleton-member { height:66px; border-radius:10px; background:linear-gradient(90deg,#F0E8D8 25%,#F8F2E8 50%,#F0E8D8 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
@keyframes shimmer { to { background-position:-200% 0; } }

.error-banner { padding:12px 16px; border-radius:10px; background:var(--tag-orange-bg); color:var(--tag-orange); font-size:13px; }

.members-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:10px; }
.member-card  { background:#fff; border-radius:10px; padding:14px 16px; border:1px solid #E5D9C5; display:flex; align-items:center; gap:12px; transition:all 0.15s; }
.member-card:hover { border-color:#C8B89A; transform:translateY(-1px); box-shadow:0 2px 10px rgba(60,30,10,0.07); }
.member-avatar { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#fff; flex-shrink:0; }
.member-info  { flex:1; min-width:0; }
.member-name  { font-size:14px; font-weight:600; color:var(--brown-900); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.member-email { font-size:12px; color:var(--brown-500); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.role-badge   { font-size:11px; padding:3px 10px; border-radius:10px; font-weight:600; flex-shrink:0; }
.badge-admin  { background:var(--tag-orange-bg); color:var(--tag-orange); }
.badge-user   { background:var(--tag-green-bg);  color:var(--tag-green); }

@media (max-width:640px) { .members-grid { grid-template-columns:1fr; } }
</style>
