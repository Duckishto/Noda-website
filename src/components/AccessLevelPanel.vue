<template>
  <div class="panel-card">
    <div class="panel-title">🔑 สิทธิการเข้าถึง</div>

    <div v-for="item in accessItems" :key="item.label" class="access-item">
      <span class="access-role">{{ item.label }}</span>
      <span class="access-badge" :class="item.badgeClass">{{ item.badge }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const accessItems = [
  { label: 'แผนที่วัฒนธรรม', badge: 'สาธารณะ', badgeClass: 'badge-public' },
  { label: 'คลังความรู้',    badge: 'สมาชิก',   badgeClass: 'badge-user' },
  { label: 'Admin Panel',    badge: 'Admin',     badgeClass: 'badge-admin' },
  { label: 'สร้างเนื้อหา',   badge: 'User',      badgeClass: 'badge-user' },
]
</script>

<style scoped>
.panel-card  { background: #fff; border-radius: 10px; padding: 16px; border: 1px solid #E5D9C5; }
.panel-title { font-size: 13px; font-weight: 600; color: var(--brown-800); margin-bottom: 12px; }

.access-item       { display: flex; align-items: center; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #F0E8D8; }
.access-item:last-child { border-bottom: none; }
.access-role       { font-size: 12.5px; color: var(--brown-800); font-weight: 500; }
.access-badge      { font-size: 10.5px; padding: 3px 10px; border-radius: 10px; font-weight: 600; }
.badge-public      { background: var(--tag-blue-bg);   color: var(--tag-blue); }
.badge-user        { background: var(--tag-green-bg);  color: var(--tag-green); }
.badge-admin       { background: var(--tag-orange-bg); color: var(--tag-orange); }
</style>
