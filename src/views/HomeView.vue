<template>
  <div>

    <!-- Banner -->
    <div class="banner">
      <div class="banner-icon">💻</div>
      <div class="banner-content">
        <div class="banner-title">Noda อยู่ระหว่างการพัฒนา หากเกิดข้อผิดพลาดโปรดแจ้ง Noda Team</div>
        <div class="banner-desc">ข้อมูลทั้งหมดอยู่ในชุมชนของคุณ สามารถใช้งานได้ปกติ</div>
      </div>
      <span class="banner-badge">● ออนไลน์</span>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in statCards" :key="stat.label">
        <span class="stat-icon">{{ stat.icon }}</span>
        <div class="stat-num">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.value" class="tab" :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
        {{ tab.label }}
      </button>
    </div>

    <!-- ── MAIN LAYOUT: 2 คอลัมน์เสมอ ── -->
    <div class="content-row">

      <!-- LEFT: Posts — มี state ของตัวเอง ไม่กระทบ right -->
      <div class="posts-col">

        <div class="posts-header">
          <div class="posts-title">กระทู้ล่าสุด</div>
          <div class="posts-count">{{ postsStore.total }} กระทู้</div>
        </div>

        <div class="filter-pills">
          <button v-for="pill in filterPills" :key="pill.value" class="pill" :class="[pill.color, { active: postsStore.activeTag === pill.value }]" @click="postsStore.setTag(pill.value)">
            {{ pill.label }}
          </button>
        </div>

        <!-- Skeleton -->
        <template v-if="postsStore.isLoading">
          <div class="posts-grid">
            <div v-for="n in 4" :key="n" class="skeleton-card">
              <div class="skeleton-thumb" />
              <div class="skeleton-body">
                <div class="skeleton-line w60" /><div class="skeleton-line w90" /><div class="skeleton-line w40" />
              </div>
            </div>
          </div>
        </template>

        <!-- Empty State — SVG illustration -->
        <template v-else-if="postsStore.filteredPosts.length === 0">
          <div class="empty-box">
            <EmptyState type="posts" @action="$emit('open-create')" />
          </div>
        </template>

        <!-- Posts Grid -->
        <template v-else>
          <div class="posts-grid">
            <PostCard v-for="post in postsStore.filteredPosts" :key="post.id" :post="post" />
          </div>
        </template>

      </div>

      <!-- RIGHT: ไม่มี v-if ไม่มี state dependency อยู่เสมอ -->
      <aside class="right-col">
        <CommunityLinksPanel />
        <div class="tip-card">
          <div class="tip-icon">💡</div>
          <div class="tip-body">
            <div class="tip-title">สงสัยอยู่หรือไม่?</div>
            <div class="tip-desc">กดปุ่ม <strong>+ สร้างกระทู้</strong> ด้านบนขวา เพื่อสอบถามคนในชุมชนท้องถิ่น</div>
          </div>
        </div>
      </aside>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePostsStore }     from '@/stores/posts'
import { useCommunityStore } from '@/stores/community'
import PostCard              from '@/components/PostCard.vue'
import CommunityLinksPanel   from '@/components/CommunityLinksPanel.vue'
import EmptyState            from '@/components/EmptyState.vue'

defineEmits(['open-create'])

const postsStore     = usePostsStore()
const communityStore = useCommunityStore()
const activeTab      = ref('all')

const statCards = computed(() => [
  { icon:'📄', value: communityStore.stats?.postCount            ?? 47,  label:'กระทู้ที่สร้าง' },
  { icon:'👤', value: communityStore.stats?.memberCount          ?? 18,  label:'ผู้ร่วมสร้าง' },
  { icon:'💬', value: communityStore.stats?.wordCount            ?? 312, label:'คลังข้อมูล' },
  { icon:'🌐', value: communityStore.stats?.connectedCommunities ?? 3,   label:'ชุมชนที่เชื่อมต่อ' },
])

const tabs = [
  { label:'ทั้งหมด', value:'all' }, { label:'ภาษาและคำศัพท์', value:'language' },
  { label:'ภูมิปัญญา', value:'wisdom' }, { label:'เรื่องเล่า', value:'story' },
  { label:'แผนที่วัฒนธรรม', value:'cultural_map' },
]

const filterPills = [
  { label:'ทั้งหมด',   value:'all',      color:'' },
  { label:'ภาษาไท้ดำ', value:'ไทดำ',     color:'blue' },
  { label:'ไทใหญ่',    value:'ไทใหญ่',   color:'green' },
  { label:'ไตดาว',     value:'ไตดาว',    color:'orange' },
  { label:'พิธีกรรม',  value:'พิธีกรรม', color:'purple' },
  { label:'อาหาร',     value:'อาหาร',    color:'orange' },
]

onMounted(() => postsStore.fetchPosts())
</script>

<style scoped>
/* Banner */
.banner { background:var(--green-dark); border-radius:12px; padding:14px 20px; display:flex; align-items:center; gap:14px; margin-bottom:20px; }
.banner-icon    { width:34px; height:34px; background:rgba(255,255,255,0.12); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
.banner-content { flex:1; min-width:0; }
.banner-title   { font-size:13.5px; font-weight:600; color:#fff; margin-bottom:2px; }
.banner-desc    { font-size:12px; color:rgba(255,255,255,0.7); }
.banner-badge   { background:rgba(123,184,74,0.2); color:var(--green-light); font-size:11px; font-weight:600; padding:4px 12px; border-radius:20px; white-space:nowrap; flex-shrink:0; border:1px solid rgba(123,184,74,0.35); }

/* Stats */
.stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px; }
.stat-card  { background:#fff; border-radius:12px; padding:16px 18px; border:1px solid #E5D9C5; transition:all 0.2s; }
.stat-card:hover { border-color:#C8B89A; transform:translateY(-2px); box-shadow:0 4px 16px rgba(60,30,10,0.08); }
.stat-icon  { font-size:20px; margin-bottom:10px; display:block; }
.stat-num   { font-size:26px; font-weight:700; color:var(--brown-900); line-height:1; margin-bottom:4px; }
.stat-label { font-size:11.5px; color:var(--brown-500); }

/* Tabs */
.tabs { display:flex; gap:2px; border-bottom:2px solid #E5D9C5; margin-bottom:20px; overflow-x:auto; scrollbar-width:none; }
.tabs::-webkit-scrollbar { display:none; }
.tab  { padding:8px 16px; font-size:13px; color:var(--brown-400); border:none; background:none; border-bottom:2px solid transparent; margin-bottom:-2px; cursor:pointer; white-space:nowrap; transition:color 0.15s; }
.tab:hover { color:var(--brown-700); }
.tab.active { color:var(--brown-900); font-weight:600; border-bottom-color:var(--green-dark); }

/* Main Layout — right col ไม่ขึ้นกับ posts state */
.content-row { display:grid; grid-template-columns:1fr 240px; gap:20px; align-items:start; }
.posts-col   { min-width:0; }
.right-col   { display:flex; flex-direction:column; gap:14px; }

/* Posts */
.posts-header { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:12px; }
.posts-title  { font-size:14px; font-weight:700; color:var(--brown-900); }
.posts-count  { font-size:11.5px; color:var(--brown-400); }

.filter-pills { display:flex; gap:6px; margin-bottom:14px; flex-wrap:wrap; }
.pill { padding:5px 12px; border-radius:20px; font-size:12px; cursor:pointer; border:1px solid transparent; background:var(--cream); color:var(--brown-600); transition:all 0.15s; }
.pill:hover  { border-color:#C8B89A; }
.pill.active { background:var(--brown-900) !important; color:#fff !important; border-color:var(--brown-900) !important; }
.pill.blue   { background:var(--tag-blue-bg);   color:var(--tag-blue);   border-color:#C5D8F4; }
.pill.green  { background:var(--tag-green-bg);  color:var(--tag-green);  border-color:#C0DDA8; }
.pill.orange { background:var(--tag-orange-bg); color:var(--tag-orange); border-color:#F5C8A0; }
.pill.purple { background:var(--tag-purple-bg); color:var(--tag-purple); border-color:#D4C8F0; }

.posts-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }

/* Empty box — ขนาดคงที่ ไม่หาย */
.empty-box  {
  background:#fff; border-radius:14px; border:1px solid #E5D9C5;
  min-height:280px; display:flex; align-items:center; justify-content:center;
}

/* Skeleton */
.skeleton-card { border-radius:10px; overflow:hidden; background:#fff; border:1px solid #E5D9C5; }
.skeleton-thumb { height:120px; background:linear-gradient(90deg,#F0E8D8 25%,#F8F2E8 50%,#F0E8D8 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
.skeleton-body  { padding:12px 14px; display:flex; flex-direction:column; gap:8px; }
.skeleton-line  { height:10px; border-radius:5px; background:linear-gradient(90deg,#F0E8D8 25%,#F8F2E8 50%,#F0E8D8 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
.skeleton-line.w60 { width:60%; }
.skeleton-line.w90 { width:90%; }
.skeleton-line.w40 { width:40%; }
@keyframes shimmer { to { background-position:-200% 0; } }

/* Tip card */
.tip-card { background:#fff; border-radius:10px; border:1px solid #E5D9C5; padding:14px 16px; display:flex; gap:10px; align-items:flex-start; }
.tip-icon  { font-size:16px; flex-shrink:0; margin-top:2px; }
.tip-title { font-size:12.5px; font-weight:600; color:var(--brown-800); margin-bottom:4px; }
.tip-desc  { font-size:12px; color:var(--brown-500); line-height:1.6; }
.tip-desc strong { color:var(--brown-700); }

/* Responsive */
@media (max-width:1024px) {
  .stats-grid  { grid-template-columns:repeat(2,1fr); }
  .content-row { grid-template-columns:1fr; }
  .right-col   { display:grid; grid-template-columns:1fr 1fr; }
}
@media (max-width:640px) {
  .stats-grid { gap:8px; } .stat-num { font-size:20px; }
  .posts-grid { grid-template-columns:1fr; }
  .right-col  { grid-template-columns:1fr; }
}
</style>
