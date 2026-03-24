<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="modal">
          <div class="modal-header">
            <span class="modal-title">✏️ สร้างโครงการใหม่</span>
            <button class="btn-close" @click="$emit('update:modelValue', false)">✕</button>
          </div>
          <form @submit.prevent="handleSubmit" class="modal-body">
            <label class="label">ชื่อโครงการ</label>
            <input v-model="form.title" class="form-input" type="text" placeholder="เช่น คำศัพท์ยุคดูลอะมาร..." required autofocus />

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

            <label class="label">ภาษา / กลุ่ม</label>
            <input v-model="form.languageGroup" class="form-input" type="text" placeholder="เช่น ไทดำ, ไทใหญ่..." />

            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="$emit('update:modelValue', false)">ยกเลิก</button>
              <button type="submit" class="btn-submit" :disabled="isLoading">
                {{ isLoading ? 'กำลังสร้าง...' : 'เริ่มสร้าง →' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useAuthStore }  from '@/stores/auth'
import type { PostTemplate } from '@/stores/posts'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

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
    emit('update:modelValue', false)
    router.push(`/posts/${post.id}`)
  } finally {
    isLoading.value = false
    form.value.title = ''
    form.value.languageGroup = ''
  }
}
</script>

<style scoped>
.backdrop { position:fixed; inset:0; z-index:200; background:rgba(30,15,5,0.55); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:20px; }
.modal { background:var(--brown-50); border-radius:14px; border:1px solid #E0D0B8; width:100%; max-width:460px; overflow:hidden; }
.modal-header { display:flex; align-items:center; justify-content:space-between; padding:18px 22px 14px; border-bottom:1px solid #E5D9C5; }
.modal-title { font-size:15px; font-weight:600; color:var(--brown-900); }
.btn-close { background:none; border:none; color:var(--brown-400); font-size:14px; cursor:pointer; padding:2px 6px; }
.modal-body { padding:20px 22px; display:flex; flex-direction:column; gap:10px; }
.label { font-size:12px; font-weight:600; color:var(--brown-700); display:block; }
.form-input { width:100%; padding:9px 12px; border-radius:8px; border:1px solid #D8C9B0; font-size:13.5px; font-family:'Sarabun',sans-serif; background:#fff; color:var(--brown-900); outline:none; transition:border 0.15s; }
.form-input:focus { border-color:var(--green-mid); }
.form-input::placeholder { color:#BBA888; }
.template-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.template-btn { padding:10px 8px; border-radius:8px; border:1.5px solid #E0D0B8; background:var(--cream); text-align:center; cursor:pointer; transition:all 0.15s; }
.template-btn.selected { border-color:var(--green-dark); background:var(--green-bg); }
.t-icon  { font-size:20px; margin-bottom:4px; }
.t-label { font-size:12px; color:var(--brown-700); font-weight:500; }
.modal-footer { display:flex; gap:10px; justify-content:flex-end; padding-top:4px; }
.btn-cancel { padding:9px 20px; border-radius:8px; border:1px solid #D8C9B0; background:#fff; color:var(--brown-600); font-size:13px; cursor:pointer; font-family:'Sarabun',sans-serif; }
.btn-submit { padding:9px 24px; border-radius:8px; border:none; background:var(--green-dark); color:#fff; font-size:13px; font-weight:600; cursor:pointer; font-family:'Sarabun',sans-serif; transition:background 0.15s; }
.btn-submit:hover:not(:disabled) { background:#245016; }
.btn-submit:disabled { opacity:0.6; cursor:not-allowed; }
.modal-enter-active,.modal-leave-active { transition:opacity 0.2s,transform 0.2s; }
.modal-enter-from,.modal-leave-to { opacity:0; }
</style>
