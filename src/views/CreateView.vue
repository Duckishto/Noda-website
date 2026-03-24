<template>
  <div class="create-layout">
    <div class="create-left">
      <CreateProjectPanel />
    </div>
    <div class="create-right">
      <div class="tip-card">
        <div class="tip-title">📌 เลือก Template ให้เหมาะกับเนื้อหา</div>
        <div class="tip-list">
          <div class="tip-item" v-for="t in tips" :key="t.icon">
            <span class="tip-icon">{{ t.icon }}</span>
            <div><div class="tip-name">{{ t.name }}</div><div class="tip-desc">{{ t.desc }}</div></div>
          </div>
        </div>
      </div>
      <div class="tip-card">
        <div class="tip-title">💡 เคล็ดลับ</div>
        <div class="tip-desc-sm">ระบุ ภาษา / กลุ่ม ให้ชัดเจน เช่น "ไทดำ" หรือ "ไทใหญ่" เพื่อให้ค้นหาได้ง่ายขึ้น</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CreateProjectPanel from '@/components/CreateProjectPanel.vue'
const tips = [
  { icon:'📖', name:'พจนานุกรม', desc:'รวบรวมคำศัพท์พร้อมคำอธิบายและเสียงอ่าน' },
  { icon:'🗺️', name:'แผนที่',    desc:'บันทึกสถานที่สำคัญและความหมายทางวัฒนธรรม' },
  { icon:'📜', name:'เรื่องเล่า', desc:'บันทึกนิทาน ตำนาน ประวัติศาสตร์ปากเปล่า' },
  { icon:'🎵', name:'บันทึกเสียง', desc:'เพลงพื้นบ้าน เสียงเล่าเรื่อง และเสียงพิธีกรรม' },
]
</script>

<style scoped>
.create-layout { display: grid; grid-template-columns: 420px 1fr; gap: 24px; align-items: start; max-width: 900px; }
.tip-card  { background:#fff; border-radius:10px; border:1px solid #E5D9C5; padding:18px 20px; margin-bottom:14px; }
.tip-title { font-size:13.5px; font-weight:600; color:var(--brown-800); margin-bottom:14px; }
.tip-list  { display:flex; flex-direction:column; gap:14px; }
.tip-item  { display:flex; gap:12px; align-items:flex-start; }
.tip-icon  { font-size:20px; flex-shrink:0; margin-top:1px; }
.tip-name  { font-size:13px; font-weight:600; color:var(--brown-900); margin-bottom:2px; }
.tip-desc  { font-size:12px; color:var(--brown-500); line-height:1.5; }
.tip-desc-sm { font-size:13px; color:var(--brown-600); line-height:1.6; }

@media (max-width: 1024px) {
  .create-layout { grid-template-columns: 1fr; max-width: 500px; }
  .create-right  { display: none; }
}
</style>
