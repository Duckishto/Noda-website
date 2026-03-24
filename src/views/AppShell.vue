<template>
  <div class="shell">

    <div v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false" />

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-brand">
        <div class="brand-name">NODA</div>
        <div class="brand-sub">Culture Powers People</div>
      </div>
      <div class="community-node">
        <div class="node-label">ชุมชนปัจจุบัน</div>
        <div class="node-value">
          <span class="node-dot" />
          <span class="node-text">{{ communityStore.info?.name || 'บ้านท้วยทราม' }}</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <RouterLink to="/" class="nav-item" :class="{ 'nav-active': route.name === 'home' }" @click="sidebarOpen = false">
          <span class="nav-icon">🏠</span><span class="nav-label">หน้าแรก</span><span class="nav-tooltip">หน้าแรก</span>
        </RouterLink>
        <RouterLink to="/knowledge" class="nav-item" @click="sidebarOpen = false">
          <span class="nav-icon">📚</span><span class="nav-label">คลังความรู้</span><span class="nav-tooltip">คลังความรู้</span>
        </RouterLink>
        <RouterLink to="/announcements" class="nav-item" @click="sidebarOpen = false">
          <span class="nav-icon">📢</span><span class="nav-label">ประกาศข่าว</span><span class="nav-tooltip">ประกาศข่าว</span>
        </RouterLink>
        <RouterLink to="/members" class="nav-item" @click="sidebarOpen = false">
          <span class="nav-icon">👥</span><span class="nav-label">สมาชิก</span><span class="nav-tooltip">สมาชิก</span>
        </RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/settings" class="nav-item" @click="sidebarOpen = false">
          <span class="nav-icon">⚙️</span><span class="nav-label">ตั้งค่าโหนด</span><span class="nav-tooltip">ตั้งค่าโหนด</span>
        </RouterLink>
      </nav>
      <div class="sidebar-bottom">
        <div class="avatar">{{ initials }}</div>
        <div class="user-info">
          <div class="user-name">{{ authStore.user?.name }}</div>
          <div class="user-role">{{ authStore.isAdmin ? 'ผู้ดูแล' : 'สมาชิก' }}</div>
        </div>
        <button class="btn-logout" @click="handleLogout">✕</button>
      </div>
    </aside>

    <main class="main-area">
      <div class="topbar">
        <button class="btn-hamburger" @click="sidebarOpen = !sidebarOpen">☰</button>
        <h1 class="page-title font-serif">{{ pageTitle }}</h1>
        <div class="topbar-actions">
          <button v-if="hasSearch" class="btn-search" @click="openSearch">🔍 ค้นหา</button>
          <button v-if="route.name === 'home'" class="btn-primary" @click="showCreate = true">
            + <span class="btn-label">สร้างโครงการ</span>
          </button>
        </div>
      </div>

      <div class="page-content">
        <RouterView />
      </div>
    </main>

    <CreateModal v-model="showCreate" />

    <!-- Search Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSearch" class="backdrop" @click.self="showSearch = false">
          <div class="search-modal">
            <div class="search-bar">
              <span class="search-icon">🔍</span>
              <input
                v-model="searchQuery"
                class="search-input"
                type="text"
                :placeholder="searchPlaceholder"
                autofocus
                @keyup.enter="submitSearch"
                @keyup.esc="showSearch = false"
              />
              <button class="search-close" @click="showSearch = false">✕</button>
            </div>
            <div class="search-scope">
              <span class="scope-badge">{{ scopeLabel }}</span>
            </div>
            <div v-if="isSearching" class="search-hint">กำลังค้นหา...</div>
            <div v-else-if="!searchQuery" class="search-hint">พิมพ์แล้วกด Enter เพื่อค้นหา</div>
            <div v-else class="search-hint">กด Enter เพื่อค้นหา "{{ searchQuery }}"</div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter }  from 'vue-router'
import { useAuthStore }         from '@/stores/auth'
import { useCommunityStore }    from '@/stores/community'
import CreateModal              from '@/components/CreateModal.vue'
import client                  from '@/api/client'

const route          = useRoute()
const router         = useRouter()
const authStore      = useAuthStore()
const communityStore = useCommunityStore()

const showCreate  = ref(false)
const showSearch  = ref(false)
const sidebarOpen = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)

const initials = computed(() => (authStore.user?.name ?? '').slice(0, 2))

const searchableRoutes = ['home', 'knowledge', 'announcements', 'members']
const hasSearch = computed(() => searchableRoutes.includes(route.name as string))

const searchConfig: Record<string, { placeholder: string; scope: string }> = {
  home:          { placeholder: 'ค้นหาชิ้นงาน คำศัพท์ หรือผู้เขียน...', scope: 'ค้นหาในคลังทั้งหมด' },
  knowledge:     { placeholder: 'ค้นหาชิ้นงานในคลังความรู้...',          scope: 'ค้นหาในคลังความรู้' },
  announcements: { placeholder: 'ค้นหาประกาศข่าว หัวข้อ หรือวันที่...',  scope: 'ค้นหาในประกาศข่าว' },
  members:       { placeholder: 'ค้นหาชื่อสมาชิก หรืออีเมล...',         scope: 'ค้นหาในรายชื่อสมาชิก' },
}

const searchPlaceholder = computed(() => searchConfig[route.name as string]?.placeholder ?? 'ค้นหา...')
const scopeLabel        = computed(() => searchConfig[route.name as string]?.scope ?? '')

const pageTitles: Record<string, string> = {
  home: 'หน้าแรก', knowledge: 'คลังความรู้ชุมชน',
  announcements: 'ประกาศข่าว', members: 'สมาชิก',
  settings: 'ตั้งค่าโหนด', 'post-detail': 'รายละเอียดชิ้นงาน',
}
const pageTitle = computed(() => pageTitles[route.name as string] ?? 'คลังความรู้ชุมชน')

function openSearch() {
  searchQuery.value = ''
  showSearch.value  = true
}

async function submitSearch() {
  if (!searchQuery.value.trim()) return
  isSearching.value = true
  try {
    await client.get('/search', {
      params: {
        q:           searchQuery.value.trim(),
        scope:       (route.name as string) || 'all',
        communityId: authStore.communityId,
      },
    })
  } finally {
    isSearching.value = false
  }
  showSearch.value = false
  router.push({ query: { q: searchQuery.value.trim() } })
}

function handleLogout() { authStore.logout(); router.push('/login') }
onMounted(() => communityStore.fetchCommunity())
</script>

<style scoped>
.shell   { display: flex; min-height: 100vh; }
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99; }

.sidebar {
  width: var(--sidebar-w); min-height: 100vh; background: var(--brown-900);
  display: flex; flex-direction: column; position: fixed; top: 0; left: 0;
  z-index: 100; overflow: visible; transition: width 0.25s ease;
}
.sidebar-brand { padding: 16px 20px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); overflow: hidden; white-space: nowrap; }
.brand-name { font-size: 17px; font-weight: 700; color: #FDF0DC; }
.brand-sub  { font-size: 9px; color: var(--brown-400); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
.community-node { margin: 10px 14px; padding: 8px 12px; background: rgba(255,255,255,0.07); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.node-label { font-size: 9px; color: var(--brown-400); letter-spacing: 1.5px; text-transform: uppercase; }
.node-value { font-size: 12px; color: var(--green-light); font-weight: 500; margin-top: 3px; display: flex; align-items: center; gap: 6px; }
.node-dot   { width: 6px; height: 6px; background: var(--green-light); border-radius: 50%; flex-shrink: 0; animation: pulse 2s infinite; }
.node-text  { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }

.sidebar-nav { flex: 1; padding: 10px 10px 0; display: flex; flex-direction: column; gap: 2px; }
.nav-item {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
  color: rgba(255,255,255,0.65); font-size: 13.5px; transition: background 0.15s;
  white-space: nowrap; position: relative; overflow: visible;
}
.nav-icon  { font-size: 18px; width: 22px; text-align: center; flex-shrink: 0; }
.nav-label { overflow: hidden; }
.nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
.nav-item.router-link-active:not([href="/"]) { background: var(--green-dark); color: #fff; font-weight: 500; }
.nav-item.nav-active { background: var(--green-dark); color: #fff; font-weight: 500; }

.nav-tooltip {
  display: none; position: absolute; left: calc(100% + 10px); top: 50%; transform: translateY(-50%);
  background: var(--brown-800); color: #FDF0DC; font-size: 12px; padding: 5px 10px;
  border-radius: 6px; white-space: nowrap; pointer-events: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3); z-index: 200;
}
.nav-tooltip::before {
  content: ''; position: absolute; right: 100%; top: 50%; transform: translateY(-50%);
  border: 5px solid transparent; border-right-color: var(--brown-800);
}

.sidebar-bottom { padding: 14px 16px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; overflow: hidden; }
.avatar    { width: 34px; height: 34px; border-radius: 50%; background: var(--brown-700); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #fff; flex-shrink: 0; }
.user-info { flex: 1; overflow: hidden; }
.user-name { font-size: 13px; font-weight: 500; color: #FDF0DC; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 11px; color: var(--brown-400); }
.btn-logout { background: none; border: none; color: rgba(255,255,255,0.3); font-size: 12px; cursor: pointer; flex-shrink: 0; }
.btn-logout:hover { color: rgba(255,255,255,0.7); }

.main-area  { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
.topbar     { height: var(--header-h); background: var(--brown-50); border-bottom: 1px solid #E0D4C0; display: flex; align-items: center; gap: 12px; padding: 0 20px; position: sticky; top: 0; z-index: 50; }
.btn-hamburger { display: none; background: none; border: none; font-size: 20px; color: var(--brown-700); padding: 4px; flex-shrink: 0; }
.page-title    { font-size: 17px; font-weight: 600; color: var(--brown-900); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.topbar-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.btn-search {
  padding: 7px 14px; border-radius: 8px; border: 1px solid #C8B89A;
  background: #fff; color: var(--brown-700); font-size: 13px; cursor: pointer;
  display: flex; align-items: center; gap: 6px; transition: background 0.15s;
}
.btn-search:hover { background: #F9F3EA; }
.btn-primary {
  padding: 7px 16px; border-radius: 8px; border: none;
  background: var(--green-dark); color: #fff; font-size: 13px; font-weight: 500;
  cursor: pointer; display: flex; align-items: center; gap: 4px; transition: background 0.15s;
}
.btn-primary:hover { background: #245016; }
.page-content { padding: 20px 24px; flex: 1; }

/* ── Search Modal ── */
.backdrop { position: fixed; inset: 0; z-index: 200; background: rgba(30,15,5,0.5); backdrop-filter: blur(4px); display: flex; align-items: flex-start; justify-content: center; padding-top: 80px; padding-inline: 16px; }
.search-modal { background: var(--brown-50); border-radius: 12px; border: 1px solid #E0D0B8; width: 100%; max-width: 560px; overflow: hidden; }
.search-bar   { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid #E5D9C5; }
.search-icon  { font-size: 16px; flex-shrink: 0; }
.search-input { flex: 1; border: none; background: none; font-size: 15px; font-family: 'Sarabun',sans-serif; color: var(--brown-900); outline: none; }
.search-input::placeholder { color: var(--brown-400); }
.search-close { background: none; border: none; font-size: 14px; color: var(--brown-400); cursor: pointer; padding: 2px 6px; border-radius: 6px; }
.search-close:hover { background: #F0E8D8; }

.search-scope { padding: 8px 16px; border-bottom: 1px solid #F0E8D8; }
.scope-badge  { font-size: 11px; padding: 3px 10px; border-radius: 10px; background: var(--tag-green-bg); color: var(--tag-green); font-weight: 600; }
.search-hint  { padding: 16px 18px; font-size: 13px; color: var(--brown-400); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.18s; }
.modal-enter-from, .modal-leave-to       { opacity: 0; }

/* ── Tablet ── */
@media (max-width: 1024px) {
  .brand-name,.brand-sub,.node-text,.nav-label,.user-info,.btn-logout,.community-node { display: none; }
  .sidebar-brand  { padding: 14px 10px; display: flex; justify-content: center; }
  .sidebar-nav    { padding: 8px 6px 0; }
  .nav-item       { justify-content: center; padding: 10px 8px; }
  .nav-icon       { width: auto; font-size: 20px; }
  .sidebar-bottom { justify-content: center; padding: 12px 6px; }
  .nav-item:hover .nav-tooltip { display: block; }
  .btn-label { display: none; }
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .sidebar    { width: 220px !important; transform: translateX(-100%); transition: transform 0.25s ease; }
  .sidebar.open { transform: translateX(0); }
  .main-area  { margin-left: 0 !important; }
  .btn-hamburger { display: block; }
  .sidebar.open .brand-name,.sidebar.open .brand-sub,.sidebar.open .node-text,
  .sidebar.open .nav-label,.sidebar.open .user-info,.sidebar.open .btn-logout,
  .sidebar.open .community-node { display: block; }
  .sidebar.open .nav-item       { justify-content: flex-start; padding: 9px 12px; }
  .sidebar.open .nav-icon       { width: 22px; font-size: 18px; }
  .sidebar.open .sidebar-bottom { justify-content: flex-start; padding: 14px 16px; }
  .sidebar.open .sidebar-brand  { justify-content: flex-start; }
  .sidebar.open .nav-tooltip    { display: none !important; }
  .page-content { padding: 14px 16px; }
  .btn-label    { display: inline; }
}
</style>
