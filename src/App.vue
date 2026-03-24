<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// ─── Restore session จาก localStorage ───────────────────────
// ทุกครั้งที่ refresh หน้า ตรวจ token แล้วดึงข้อมูล user กลับมา
// ถ้า token หมดอายุ → backend คืน 401 → store จะ logout อัตโนมัติ
onMounted(async () => {
  if (authStore.token) {
    await authStore.fetchMe()
  }
})
</script>
