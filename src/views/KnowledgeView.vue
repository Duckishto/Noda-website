<template>
  <div>

    <div class="page-header">
      <div class="page-desc">รวบรวมความรู้ท้องถิ่น ภาษา วัฒนธรรม และภูมิปัญญาของชุมชน</div>
      <span class="stat-chip">📄 {{ postsStore.total }} ชิ้นงาน</span>
    </div>

    <div class="filter-row">
      <div class="filter-pills">
        <button
          v-for="pill in filterPills" :key="pill.value"
          class="pill" :class="[pill.color, { active: postsStore.activeTag === pill.value }]"
          @click="postsStore.setTag(pill.value)"
        >{{ pill.label }}</button>
      </div>
      <select class="sort-select" v-model="sortBy">
        <option value="newest">ล่าสุดก่อน</option>
        <option value="oldest">เก่าสุดก่อน</option>
      </select>
    </div>

    <!-- Skeleton -->
    <div v-if="postsStore.isLoading" class="posts-grid">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="skeleton-thumb" />
        <div class="skeleton-body">
          <div class="skeleton-line w50" /><div class="skeleton-line w80" /><div class="skeleton-line w35" />
        </div>
      </div>
    </div>

    <!-- Empty — อยู่ใน wrapper กว้างเต็ม ไม่แทนทั้งหน้า -->
    <div v-else-if="postsStore.posts.length === 0" class="empty-wrap">
      <EmptyState type="knowledge" />
    </div>

    <!-- Grid -->
    <div v-else class="posts-grid">
      <PostCard v-for="post in postsStore.posts" :key="post.id" :post="post" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import PostCard   from '@/components/PostCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const postsStore = usePostsStore()
const sortBy     = ref('newest')

const filterPills = [
  { label:'ทั้งหมด',   value:'all',      color:'' },
  { label:'ภาษาไท้ดำ', value:'ไทดำ',     color:'blue' },
  { label:'ไทใหญ่',    value:'ไทใหญ่',   color:'green' },
  { label:'ไตดาว',     value:'ไตดาว',    color:'orange' },
  { label:'พิธีกรรม',  value:'พิธีกรรม', color:'purple' },
  { label:'อาหาร',     value:'อาหาร',    color:'orange' },
]

onMounted(() => postsStore.fetchPosts()) // isFetched=true จะ skip เอง
</script>

<style scoped>
.page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:10px; }
.page-desc   { font-size:13px; color:var(--brown-500); }
.stat-chip   { font-size:12px; padding:4px 12px; border-radius:20px; background:#fff; border:1px solid #E5D9C5; color:var(--brown-600); font-weight:500; }

.filter-row  { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
.filter-pills { display:flex; gap:6px; flex-wrap:wrap; }
.pill { padding:5px 12px; border-radius:20px; font-size:12px; cursor:pointer; border:1px solid transparent; background:var(--cream); color:var(--brown-600); transition:all 0.15s; }
.pill:hover  { border-color:#C8B89A; }
.pill.active { background:var(--brown-900) !important; color:#fff !important; border-color:var(--brown-900) !important; }
.pill.blue   { background:var(--tag-blue-bg);   color:var(--tag-blue);   border-color:#C5D8F4; }
.pill.green  { background:var(--tag-green-bg);  color:var(--tag-green);  border-color:#C0DDA8; }
.pill.orange { background:var(--tag-orange-bg); color:var(--tag-orange); border-color:#F5C8A0; }
.pill.purple { background:var(--tag-purple-bg); color:var(--tag-purple); border-color:#D4C8F0; }

.sort-select { padding:6px 10px; border-radius:8px; border:1px solid #D8C9B0; font-size:12.5px; font-family:'Sarabun',sans-serif; color:var(--brown-700); background:#fff; cursor:pointer; outline:none; }

.posts-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }

/* Empty wrapper เต็มความกว้าง ไม่หาย component ข้างๆ */
.empty-wrap { background:#fff; border-radius:12px; border:1px solid #E5D9C5; min-height:260px; display:flex; align-items:center; justify-content:center; }

.skeleton-card { border-radius:10px; overflow:hidden; background:#fff; border:1px solid #E5D9C5; }
.skeleton-thumb { height:120px; background:linear-gradient(90deg,#F0E8D8 25%,#F8F2E8 50%,#F0E8D8 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
.skeleton-body  { padding:12px 14px; display:flex; flex-direction:column; gap:8px; }
.skeleton-line  { height:10px; border-radius:5px; background:linear-gradient(90deg,#F0E8D8 25%,#F8F2E8 50%,#F0E8D8 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
.skeleton-line.w50 { width:50%; } .skeleton-line.w80 { width:80%; } .skeleton-line.w35 { width:35%; }
@keyframes shimmer { to { background-position:-200% 0; } }

@media (max-width:1024px) { .posts-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:640px)  { .posts-grid { grid-template-columns:1fr; } }
</style>
