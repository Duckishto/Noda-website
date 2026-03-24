<template>
  <div class="settings-wrap">
    <div class="settings-card">
      <h2 class="settings-title">ตั้งค่าโหนดชุมชน</h2>

      <div class="field">
        <label class="label">ชื่อชุมชน</label>
        <input v-model="form.name" class="input" type="text" />
      </div>
      <div class="field">
        <label class="label">โดเมน</label>
        <input v-model="form.domain" class="input" type="text" disabled />
        <span class="field-hint">โดเมนไม่สามารถเปลี่ยนได้</span>
      </div>
      <div class="field">
        <label class="label">คำอธิบาย</label>
        <textarea v-model="form.description" class="input textarea" rows="3" />
      </div>

      <p v-if="saveError" class="error-msg">{{ saveError }}</p>
      <p v-if="saveSuccess" class="success-msg">✓ บันทึกสำเร็จ</p>

      <button class="btn-save" :disabled="isSaving" @click="handleSave">
        {{ isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCommunityStore } from '@/stores/community'
import client from '@/api/client'

const communityStore = useCommunityStore()

const form = ref({
  name:        communityStore.info?.name        ?? '',
  domain:      communityStore.info?.domain      ?? '',
  description: communityStore.info?.description ?? '',
})

// sync เมื่อ communityStore โหลดข้อมูลเสร็จ
watch(() => communityStore.info, (info) => {
  if (info) {
    form.value.name        = info.name
    form.value.domain      = info.domain
    form.value.description = info.description ?? ''
  }
})

const isSaving    = ref(false)
const saveError   = ref('')
const saveSuccess = ref(false)

async function handleSave() {
  isSaving.value    = true
  saveError.value   = ''
  saveSuccess.value = false
  try {
    const cid = communityStore.info?.id
    if (!cid) throw new Error('ไม่พบ communityId')
    await client.patch(`/community/${cid}`, {
      name:        form.value.name,
      description: form.value.description,
    })
    // อัพเดต store ด้วย
    await communityStore.fetchCommunity()
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 3000)
  } catch (e: any) {
    saveError.value = e?.response?.data?.message || 'บันทึกไม่สำเร็จ'
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.settings-wrap { max-width: 500px; }
.settings-card { background: #fff; border-radius: 12px; padding: 28px; border: 1px solid #E5D9C5; }
.settings-title { font-size: 17px; font-weight: 700; color: var(--brown-900); margin-bottom: 22px; font-family: 'Noto Serif Thai', serif; }
.field    { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
.label    { font-size: 12.5px; font-weight: 600; color: var(--brown-700); }
.field-hint { font-size: 11.5px; color: var(--brown-400); }
.input    { padding: 9px 12px; border-radius: 8px; border: 1px solid #D8C9B0; font-size: 13.5px; background: #FDFAF5; color: var(--brown-900); outline: none; transition: border 0.15s; }
.input:focus { border-color: var(--green-mid); }
.input:disabled { background: #F0EBE3; color: var(--brown-400); cursor: not-allowed; }
.textarea { resize: vertical; }
.error-msg   { font-size:12.5px; color:var(--tag-orange); background:var(--tag-orange-bg); padding:8px 12px; border-radius:7px; margin-bottom:10px; }
.success-msg { font-size:12.5px; color:var(--tag-green);  background:var(--tag-green-bg);  padding:8px 12px; border-radius:7px; margin-bottom:10px; }
.btn-save { padding: 10px 24px; border-radius: 8px; border: none; background: var(--green-dark); color: #fff; font-size: 13px; font-weight: 600; transition: background 0.15s; cursor: pointer; }
.btn-save:hover:not(:disabled) { background: #245016; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
