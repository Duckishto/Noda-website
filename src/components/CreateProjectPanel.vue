<template>
  <div class="panel-card">
    <div class="panel-title">✏️ สร้างโครงการใหม่</div>
    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label class="label">ชื่อโครงการ</label>
        <input v-model="form.title" class="form-input" type="text" placeholder="เช่น คำศัพท์ยุคดูลอะมาร..." required />
      </div>

      <div class="field">
        <label class="label">เลือก TEMPLATE</label>
        <div class="template-grid">
          <button
            v-for="t in templates" :key="t.value"
            type="button"
            class="template-btn"
            :class="{ selected: form.template === t.value }"
            @click="form.template = t.value as PostTemplate"
          >
            <div class="t-icon">{{ t.icon }}</div>
            <div class="t-label">{{ t.label }}</div>
          </button>
        </div>
      </div>

      <div class="field">
        <label class="label">ภาษา / กลุ่ม</label>
        <input v-model="form.languageGroup" class="form-input" type="text" placeholder="เช่น ไทดำ, ไทใหญ่..." />
      </div>

      <button type="submit" class="btn-submit" :disabled="isLoading">
        {{ isLoading ? 'กำลังสร้าง...' : 'เริ่มสร้าง →' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useAuthStore }  from '@/stores/auth'
import type { PostTemplate } from '@/stores/posts'

const router     = useRouter()
const postsStore = usePostsStore()
const authStore  = useAuthStore()
const isLoading  = ref(false)

const form = ref({
  title:         '',
  template:      'dictionary' as PostTemplate,
  languageGroup: '',
})

const templates: { value: PostTemplate; icon: string; label: string }[] = [
  { value: 'dictionary', icon: '📖', label: 'พจนานุกรม' },
  { value: 'map',        icon: '🗺️', label: 'แผนที่' },
  { value: 'story',      icon: '📜', label: 'เรื่องเล่า' },
  { value: 'audio',      icon: '🎵', label: 'บันทึกเสียง' },
]

async function handleSubmit() {
  if (!form.value.title) return
  isLoading.value = true
  try {
    const post = await postsStore.createPost({
      title:         form.value.title,
      template:      form.value.template,
      category:      'language',
      tags:          form.value.languageGroup ? [form.value.languageGroup] : [],
      languageGroup: form.value.languageGroup,
      communityId:   authStore.communityId,
    })
    router.push(`/posts/${post.id}`)
  } finally {
    isLoading.value = false
    form.value.title = ''
    form.value.languageGroup = ''
  }
}
</script>

<style scoped>
.panel-card  { background:#fff; border-radius:10px; border:1px solid #E5D9C5; padding:16px; }
.panel-title { font-size:13.5px; font-weight:600; color:var(--brown-800); margin-bottom:14px; }
.field       { margin-bottom:12px; }
.label       { font-size:12px; font-weight:600; color:var(--brown-700); display:block; margin-bottom:6px; }
.form-input  { width:100%; padding:8px 12px; border-radius:8px; border:1px solid #D8C9B0; font-size:13px; font-family:'Sarabun',sans-serif; color:var(--brown-900); background:#FDFAF5; outline:none; transition:border 0.15s; }
.form-input:focus { border-color:var(--green-mid); }
.template-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.template-btn  { padding:10px 8px; border-radius:8px; border:1.5px solid #E0D0B8; background:var(--cream); text-align:center; cursor:pointer; transition:all 0.15s; }
.template-btn.selected { border-color:var(--green-dark); background:var(--green-bg); }
.t-icon  { font-size:20px; margin-bottom:4px; }
.t-label { font-size:12px; color:var(--brown-700); font-weight:500; }
.btn-submit { width:100%; padding:10px; border-radius:8px; border:none; background:#E8A830; color:var(--brown-900); font-size:13px; font-weight:600; cursor:pointer; font-family:'Sarabun',sans-serif; transition:background 0.15s; margin-top:4px; }
.btn-submit:hover:not(:disabled) { background:#D99820; }
.btn-submit:disabled { opacity:0.6; cursor:not-allowed; }
</style>
