<template>
  <RouterLink :to="`/posts/${post.id}`" class="post-card">
    <div class="post-thumb" :class="config!.thumb">
      <span class="post-emoji">{{ config!.emoji }}</span>
    </div>
    <div class="post-body">
      <span class="badge" :class="config!.badge">{{ config!.label }}</span>
      <div class="post-title">{{ post.title }}</div>
      <div class="post-meta">
        <div class="post-author">
          <div class="avatar" :style="{ background: avatarColor }">
            {{ post.authorName.slice(0, 2) }}
          </div>
          <span>{{ post.authorName }}</span>
        </div>
      </div>
      <div class="post-tags" v-if="post.tags.length">
        <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Post, PostTemplate } from '@/stores/posts'

const props = defineProps<{ post: Post }>()

interface TemplateConfig {
  emoji: string
  thumb: string
  badge: string
  label: string
}

const templateConfig: Record<PostTemplate, TemplateConfig> = {
  dictionary: { emoji: '📖', thumb: 'thumb-amber',  badge: 'badge-vocab', label: 'พจนานุกรม' },
  map:        { emoji: '🗺️', thumb: 'thumb-green',  badge: 'badge-map',   label: 'แผนที่' },
  audio:      { emoji: '🎵', thumb: 'thumb-blue',   badge: 'badge-song',  label: 'บันทึกเสียง' },
  story:      { emoji: '📜', thumb: 'thumb-pink',   badge: 'badge-story', label: 'เรื่องเล่า' },
}

// ใช้ non-null default เพื่อแก้ TS2048
const config = computed<TemplateConfig>(
  () => templateConfig[props.post.template] ?? templateConfig.story
)

const avatarColors = ['#4A7C2F', '#3B72C2', '#5E3AAA', '#A84E10', '#7A4520']
const avatarColor  = computed(() => avatarColors[props.post.authorId % avatarColors.length])
</script>

<style scoped>
.post-card { display:block; border-radius:10px; overflow:hidden; background:#fff; border:1px solid #E5D9C5; transition:all 0.15s; text-decoration:none; color:inherit; }
.post-card:hover { transform:translateY(-2px); box-shadow:0 4px 16px rgba(60,30,10,0.1); border-color:#C8B89A; }

.post-thumb { height:110px; display:flex; align-items:center; justify-content:center; }
.thumb-amber { background:#FEF3D6; }
.thumb-green { background:#E8F2DE; }
.thumb-blue  { background:#E6EEF9; }
.thumb-pink  { background:#FDE8F0; }
.post-emoji  { font-size:36px; }

.post-body   { padding:12px 14px; }
.badge       { font-size:10px; padding:2px 8px; border-radius:10px; font-weight:600; display:inline-block; margin-bottom:6px; }
.badge-vocab { background:#FEF3D6; color:#A84E10; }
.badge-map   { background:#E8F2DE; color:#3A7820; }
.badge-song  { background:#E6EEF9; color:#3B72C2; }
.badge-story { background:#FDE8F0; color:#9B2560; }

.post-title { font-size:13.5px; font-weight:600; color:var(--brown-900); line-height:1.4; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.post-meta  { display:flex; align-items:center; margin-bottom:8px; }
.post-author { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--brown-500); }
.avatar { width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:700; color:#fff; flex-shrink:0; }

.post-tags { display:flex; gap:4px; flex-wrap:wrap; }
.tag { font-size:10px; padding:2px 8px; border-radius:10px; background:var(--cream); color:var(--brown-500); border:1px solid #E0D0B8; }
</style>
