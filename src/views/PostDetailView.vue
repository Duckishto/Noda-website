<template>
  <div class="detail-page">

    <!-- ── Back button ── -->
    <button class="btn-back" @click="router.back()">
      <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
        <path d="M12 5L7 10l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      กลับ
    </button>

    <!-- ── Loading ── -->
    <div v-if="isLoading" class="state-wrap">
      <div class="skeleton-header" />
      <div class="skeleton-body">
        <div class="sk-line w80" />
        <div class="sk-line w60" />
        <div class="sk-line w90" />
        <div class="sk-line w50" />
      </div>
    </div>

    <!-- ── Not found ── -->
    <div v-else-if="!post" class="state-wrap empty-state">
      <div class="empty-icon">📭</div>
      <div class="empty-title">ไม่พบชิ้นงาน</div>
      <div class="empty-desc">อาจถูกลบไปแล้ว หรือ URL ไม่ถูกต้อง</div>
      <button class="btn-home" @click="router.push('/')">กลับหน้าหลัก</button>
    </div>

    <!-- ── Post ── -->
    <div v-else class="post-layout">

      <!-- Hero -->
      <div class="post-hero" :class="`hero-${post.template}`">
        <div class="hero-emoji">{{ templateEmoji }}</div>
        <div class="hero-overlay" />
      </div>

      <!-- Content card -->
      <div class="post-card">

        <!-- Badge + title -->
        <div class="post-top">
          <span class="badge" :class="`badge-${post.template}`">{{ templateLabel }}</span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>

        <!-- Meta row -->
        <div class="post-meta">
          <div class="meta-item">
            <div class="meta-avatar" :style="{ background: avatarColor }">
              {{ post.authorName.slice(0, 2) }}
            </div>
            <span>{{ post.authorName }}</span>
          </div>
          <div class="meta-divider" />
          <div class="meta-item">
            <svg viewBox="0 0 20 20" fill="none" width="14" height="14"><rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h14M7 4v2m6-2v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
          <div class="meta-divider" />
          <div class="meta-item">
            <svg viewBox="0 0 20 20" fill="none" width="14" height="14"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/></svg>
            <span>{{ post.viewCount }} ครั้ง</span>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="post.tags.length" class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <!-- Divider -->
        <div class="post-divider" />

        <!-- Content placeholder -->
        <div class="post-content">
          <div class="content-placeholder">
            <div class="ph-icon">✏️</div>
            <div class="ph-text">เนื้อหายังไม่มี — ฟีเจอร์นี้จะเพิ่มในเวอร์ชันถัดไป</div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postsApi } from '@/api'
import type { Post } from '@/types'

const route  = useRoute()
const router = useRouter()

const post      = ref<Post | null>(null)
const isLoading = ref(false)

const templateLabels: Record<string, string> = {
  dictionary: 'พจนานุกรม',
  map:        'แผนที่',
  story:      'เรื่องเล่า',
  audio:      'บันทึกเสียง',
}
const templateEmojis: Record<string, string> = {
  dictionary: '📖',
  map:        '🗺️',
  story:      '📜',
  audio:      '🎵',
}

const templateLabel = computed(() => templateLabels[post.value?.template ?? ''] ?? '')
const templateEmoji = computed(() => templateEmojis[post.value?.template ?? ''] ?? '📄')

const avatarColors = ['#4A7C2F', '#3B72C2', '#5E3AAA', '#A84E10', '#7A4520']
const avatarColor  = computed(() =>
  post.value ? avatarColors[post.value.authorId % avatarColors.length] : '#4A7C2F'
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

onMounted(async () => {
  isLoading.value = true
  try {
    const res = await postsApi.getById(Number(route.params.id))
    post.value = res.data
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.detail-page { min-height: calc(100vh - var(--header-h)); }

/* ── Back button ── */
.btn-back {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 10px; border: 1px solid #E0D0B8;
  background: #fff; color: var(--brown-600); font-size: 13px;
  font-family: 'Sarabun', sans-serif; cursor: pointer;
  margin-bottom: 20px; transition: all 0.15s;
}
.btn-back:hover { border-color: var(--brown-500); background: var(--cream); transform: translateX(-2px); }

/* ── Loading skeleton ── */
.state-wrap { width: 100%; }
.skeleton-header { height: 200px; border-radius: 16px; background: linear-gradient(90deg,#F0E8D8 25%,#F8F2E8 50%,#F0E8D8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; margin-bottom: 16px; }
.skeleton-body  { background: #fff; border-radius: 16px; padding: 28px; border: 1px solid #E5D9C5; display: flex; flex-direction: column; gap: 12px; }
.sk-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg,#F0E8D8 25%,#F8F2E8 50%,#F0E8D8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.sk-line.w80 { width: 80%; } .sk-line.w60 { width: 60%; } .sk-line.w90 { width: 90%; } .sk-line.w50 { width: 50%; }
@keyframes shimmer { to { background-position: -200% 0; } }

/* ── Empty state ── */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; text-align: center; }
.empty-icon  { font-size: 52px; margin-bottom: 16px; animation: float 3s ease-in-out infinite; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
.empty-title { font-size: 18px; font-weight: 700; color: var(--brown-800); margin-bottom: 8px; font-family: 'Noto Serif Thai', serif; }
.empty-desc  { font-size: 13.5px; color: var(--brown-400); margin-bottom: 24px; }
.btn-home { padding: 10px 24px; border-radius: 10px; border: none; background: var(--green-dark); color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Sarabun', sans-serif; }

/* ── Post layout ── */
.post-layout { width: 100%; }

/* Hero */
.post-hero {
  height: 220px; border-radius: 20px; margin-bottom: -40px;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.hero-dictionary { background: linear-gradient(135deg, #FEF3D6, #F5C842); }
.hero-map        { background: linear-gradient(135deg, #E8F2DE, #7BB84A); }
.hero-story      { background: linear-gradient(135deg, #EBE5F8, #9B6DDB); }
.hero-audio      { background: linear-gradient(135deg, #E6EEF9, #3B72C2); }
.hero-emoji      { font-size: 80px; position: relative; z-index: 2; filter: drop-shadow(0 8px 24px rgba(0,0,0,0.15)); animation: float 4s ease-in-out infinite; }
.hero-overlay    { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.08)); }

/* Card */
.post-card {
  background: #fff; border-radius: 20px; border: 1px solid #E5D9C5;
  padding: 40px 40px 36px; position: relative; z-index: 1;
  box-shadow: 0 4px 24px rgba(60,30,10,0.07);
}

.post-top { margin-bottom: 12px; }
.badge { display: inline-block; font-size: 11px; padding: 4px 12px; border-radius: 20px; font-weight: 600; }
.badge-dictionary { background: var(--tag-orange-bg); color: var(--tag-orange); }
.badge-map        { background: var(--tag-green-bg);  color: var(--tag-green); }
.badge-story      { background: var(--tag-purple-bg); color: var(--tag-purple); }
.badge-audio      { background: var(--tag-blue-bg);   color: var(--tag-blue); }

.post-title { font-size: 26px; font-weight: 700; color: var(--brown-900); line-height: 1.4; margin-bottom: 20px; font-family: 'Noto Serif Thai', serif; }

/* Meta */
.post-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.meta-item { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--brown-500); }
.meta-avatar { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #fff; }
.meta-divider { width: 4px; height: 4px; border-radius: 50%; background: #D8C9B0; }

/* Tags */
.post-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px; }
.tag { padding: 4px 12px; border-radius: 20px; font-size: 11.5px; background: var(--cream); color: var(--brown-600); border: 1px solid #E0D0B8; }

.post-divider { height: 1px; background: #F0E8D8; margin-bottom: 28px; }

/* Content placeholder */
.post-content { min-height: 200px; display: flex; align-items: center; justify-content: center; }
.content-placeholder { text-align: center; padding: 40px; }
.ph-icon { font-size: 36px; margin-bottom: 12px; }
.ph-text { font-size: 13px; color: var(--brown-400); }

/* Responsive */
@media (max-width: 640px) {
  .post-card { padding: 28px 20px; }
  .post-title { font-size: 20px; }
  .post-hero { height: 160px; }
  .hero-emoji { font-size: 56px; }
}
</style>
