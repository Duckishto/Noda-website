<template>
  <div class="content-row">
    <div class="ann-section">
      <div class="ann-header">
        <div class="ann-count">{{ announcements.length }} ประกาศ</div>
        <button v-if="authStore.isAdmin" class="btn-new" @click="showForm = !showForm">
          {{ showForm ? '✕ ยกเลิก' : '+ เพิ่มประกาศ' }}
        </button>
      </div>

      <Transition name="slide">
        <div v-if="showForm && authStore.isAdmin" class="ann-form">
          <input v-model="form.title" class="form-input" type="text" placeholder="หัวข้อประกาศ..." />
          <textarea v-model="form.body" class="form-input form-textarea" placeholder="รายละเอียด..." rows="3" />
          <div class="form-row">
            <label class="form-label-inline">📅 วันที่กิจกรรม</label>
            <input v-model="form.eventDate" class="form-input form-date" type="date" />
            <select v-model="form.type" class="form-input form-select">
              <option value="general">ทั่วไป</option>
              <option value="event">กิจกรรม</option>
              <option value="urgent">ด่วน</option>
            </select>
            <button class="btn-submit" :disabled="isPosting" @click="handlePost">
              {{ isPosting ? 'กำลังส่ง...' : 'เผยแพร่' }}
            </button>
          </div>
        </div>
      </Transition>

      <!-- Loading -->
      <div v-if="isLoading" class="loading-list">
        <div v-for="n in 3" :key="n" class="skeleton-ann" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-banner">{{ error }}</div>

      <!-- Empty -->
      <EmptyState v-else-if="announcements.length === 0" type="announcements" />

      <!-- List -->
      <div v-else class="ann-list">
        <div v-for="ann in announcements" :key="ann.id" class="ann-card">
          <div class="ann-top">
            <span class="ann-badge" :class="`badge-${ann.type}`">{{ typeLabel[ann.type] }}</span>
            <div class="ann-actions">
              <span class="ann-date">{{ formatDate(ann.createdAt) }}</span>
              <button v-if="authStore.isAdmin" class="btn-delete" @click="handleDelete(ann.id)" title="ลบ">✕</button>
            </div>
          </div>
          <div class="ann-title">{{ ann.title }}</div>
          <div class="ann-body">{{ ann.body }}</div>
          <div class="ann-footer">
            <span class="ann-author">📌 {{ ann.authorName }}</span>
            <span v-if="ann.eventDate" class="ann-event-date">📅 {{ formatDate(ann.eventDate) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar (เหมือนเดิม ไม่เปลี่ยน) -->
    <div class="cal-section">
      <div class="panel-card">
        <div class="cal-nav">
          <button class="cal-btn" @click="prevMonth">‹</button>
          <div class="cal-title">{{ monthName }} {{ year + 543 }}</div>
          <button class="cal-btn" @click="nextMonth">›</button>
        </div>
        <div class="cal-grid">
          <div v-for="d in dayNames" :key="d" class="cal-head">{{ d }}</div>
          <div v-for="n in firstDay" :key="'e'+n" class="cal-cell" />
          <div
            v-for="day in daysInMonth" :key="day"
            class="cal-cell cal-day"
            :class="{ 'is-today': isToday(day), 'has-event': hasEvent(day), 'is-selected': selectedDay === day }"
            @click="selectedDay = day"
          >
            {{ day }}
            <span v-if="hasEvent(day)" class="event-dot" />
          </div>
        </div>
        <Transition name="slide">
          <div v-if="selectedDay" class="cal-events">
            <div class="cal-events-title">{{ selectedDay }} {{ monthName }}</div>
            <div v-if="eventsOnDay(selectedDay).length === 0" class="cal-no-event">ไม่มีกิจกรรม</div>
            <div v-for="ev in eventsOnDay(selectedDay)" :key="ev.id" class="cal-event-item">
              <span class="cal-event-dot" :class="`dot-${ev.type}`" />{{ ev.title }}
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAnnouncementsStore } from '@/stores/announcements'
import EmptyState from '@/components/EmptyState.vue'

const authStore         = useAuthStore()
const announcementsStore = useAnnouncementsStore()

const showForm  = ref(false)
const isPosting = ref(false)
const form      = ref({ title: '', body: '', type: 'general', eventDate: '' })

const { announcements, isLoading, error } = announcementsStore

const typeLabel: Record<string, string> = {
  general: 'ทั่วไป', event: 'กิจกรรม', urgent: 'ด่วน',
}

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
}

async function handlePost() {
  if (!form.value.title || !form.value.body) return
  isPosting.value = true
  try {
    await announcementsStore.createAnnouncement(form.value)
    form.value  = { title: '', body: '', type: 'general', eventDate: '' }
    showForm.value = false
  } finally {
    isPosting.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('ลบประกาศนี้?')) return
  await announcementsStore.deleteAnnouncement(id)
}

onMounted(() => announcementsStore.fetchAnnouncements())

// ─── Calendar ────────────────────────────────────
const today        = new Date()
const currentMonth = ref(today.getMonth())
const currentYear  = ref(today.getFullYear())
const selectedDay  = ref<number | null>(today.getDate())
const monthNames   = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']
const dayNames     = ['อา','จ','อ','พ','พฤ','ศ','ส']
const monthName    = computed(() => monthNames[currentMonth.value])
const year         = computed(() => currentYear.value)
const daysInMonth  = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())
const firstDay     = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay())

function prevMonth() { currentMonth.value === 0 ? (currentMonth.value = 11, currentYear.value--) : currentMonth.value--; selectedDay.value = null }
function nextMonth() { currentMonth.value === 11 ? (currentMonth.value = 0, currentYear.value++) : currentMonth.value++; selectedDay.value = null }
function isToday(day: number) { return day === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear() }

interface CalEvent { id: number; title: string; type: string; d: Date }

const eventDates = computed<CalEvent[]>(() =>
  announcementsStore.announcements
    .filter((a): a is typeof a & { eventDate: string } => !!a.eventDate)
    .map(a => ({ id: a.id, title: a.title, type: a.type, d: new Date(a.eventDate) }))
    .filter(a => a.d.getMonth() === currentMonth.value && a.d.getFullYear() === currentYear.value)
)
function hasEvent(day: number) { return eventDates.value.some((e: CalEvent) => e.d.getDate() === day) }
function eventsOnDay(day: number) { return eventDates.value.filter((e: CalEvent) => e.d.getDate() === day) }
</script>

<style scoped>
.content-row { display:grid; grid-template-columns:1fr 240px; gap:20px; align-items:start; }
.ann-section { grid-column:1; }
.cal-section { grid-column:2; grid-row:1; position:sticky; top:calc(var(--header-h) + 20px); }
.ann-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.ann-count  { font-size:13px; color:var(--brown-500); }
.btn-new    { padding:7px 14px; border-radius:8px; border:none; background:var(--green-dark); color:#fff; font-size:13px; font-weight:500; cursor:pointer; }
.ann-form   { background:#fff; border-radius:12px; border:1px solid #E5D9C5; padding:16px; margin-bottom:16px; display:flex; flex-direction:column; gap:10px; }
.form-input { width:100%; padding:8px 12px; border-radius:8px; border:1px solid #D8C9B0; font-size:13px; font-family:'Sarabun',sans-serif; color:var(--brown-900); background:#FDFAF5; outline:none; box-sizing:border-box; }
.form-input:focus { border-color:var(--green-mid); }
.form-textarea { resize:vertical; }
.form-select,.form-date { width:auto; }
.form-label-inline { font-size:12px; color:var(--brown-500); white-space:nowrap; }
.form-row   { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.btn-submit { padding:8px 16px; border-radius:8px; border:none; background:#E8A830; color:var(--brown-900); font-size:13px; font-weight:600; cursor:pointer; font-family:'Sarabun',sans-serif; white-space:nowrap; }
.btn-submit:disabled { opacity:0.6; cursor:not-allowed; }

/* Loading skeleton */
.loading-list { display:flex; flex-direction:column; gap:10px; }
.skeleton-ann { height:100px; border-radius:12px; background:linear-gradient(90deg,#F0E8D8 25%,#F8F2E8 50%,#F0E8D8 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
@keyframes shimmer { to { background-position:-200% 0; } }

.error-banner { padding:12px 16px; border-radius:10px; background:var(--tag-orange-bg); color:var(--tag-orange); font-size:13px; }

.ann-list   { display:flex; flex-direction:column; gap:10px; }
.ann-card   { background:#fff; border-radius:12px; border:1px solid #E5D9C5; padding:18px 20px; transition:all 0.15s; }
.ann-card:hover { border-color:#C8B89A; box-shadow:0 2px 12px rgba(60,30,10,0.07); }
.ann-top    { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.ann-actions { display:flex; align-items:center; gap:8px; }
.ann-badge  { font-size:11px; padding:3px 10px; border-radius:10px; font-weight:600; }
.badge-general { background:var(--tag-blue-bg);   color:var(--tag-blue); }
.badge-event   { background:var(--tag-green-bg);  color:var(--tag-green); }
.badge-urgent  { background:var(--tag-orange-bg); color:var(--tag-orange); }
.ann-date   { font-size:12px; color:var(--brown-400); }
.btn-delete { background:none; border:none; font-size:11px; color:var(--brown-300); cursor:pointer; padding:2px 6px; border-radius:4px; }
.btn-delete:hover { color:#E24B4A; background:#FCEBEB; }
.ann-title  { font-size:15px; font-weight:700; color:var(--brown-900); margin-bottom:8px; font-family:'Noto Serif Thai',serif; line-height:1.4; }
.ann-body   { font-size:13px; color:var(--brown-700); line-height:1.7; margin-bottom:12px; }
.ann-footer { border-top:1px solid #F0E8D8; padding-top:10px; display:flex; gap:14px; flex-wrap:wrap; }
.ann-author,.ann-event-date { font-size:12px; color:var(--brown-500); }
.panel-card { background:#fff; border-radius:12px; border:1px solid #E5D9C5; padding:16px; }
.cal-nav    { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.cal-title  { font-size:13px; font-weight:600; color:var(--brown-900); }
.cal-btn    { background:none; border:none; font-size:18px; color:var(--brown-500); cursor:pointer; padding:2px 8px; border-radius:6px; }
.cal-btn:hover { background:var(--cream); }
.cal-grid   { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.cal-head   { text-align:center; font-size:10px; font-weight:600; color:var(--brown-400); padding:4px 0; }
.cal-cell   { text-align:center; padding:6px 2px; font-size:12px; color:var(--brown-700); border-radius:6px; position:relative; }
.cal-day    { cursor:pointer; transition:background 0.12s; }
.cal-day:hover { background:var(--cream); }
.is-today   { background:var(--green-bg); color:var(--green-dark); font-weight:700; }
.is-selected { background:var(--green-dark) !important; color:#fff; font-weight:600; }
.event-dot  { position:absolute; bottom:2px; left:50%; transform:translateX(-50%); width:4px; height:4px; border-radius:50%; background:var(--tag-orange); }
.is-selected .event-dot { background:#fff; }
.cal-events { margin-top:12px; padding-top:12px; border-top:1px solid #F0E8D8; }
.cal-events-title { font-size:12px; font-weight:600; color:var(--brown-800); margin-bottom:8px; }
.cal-no-event     { font-size:12px; color:var(--brown-400); }
.cal-event-item   { display:flex; align-items:center; gap:7px; font-size:12px; color:var(--brown-700); margin-bottom:5px; }
.cal-event-dot    { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.dot-event   { background:var(--tag-green); }
.dot-urgent  { background:var(--tag-orange); }
.dot-general { background:var(--tag-blue); }
.slide-enter-active,.slide-leave-active { transition:all 0.2s ease; }
.slide-enter-from,.slide-leave-to       { opacity:0; transform:translateY(-8px); }
@media (max-width:1024px) { .content-row { grid-template-columns:1fr 220px; } }
@media (max-width:640px)  { .content-row { grid-template-columns:1fr; } .ann-section { grid-column:1; grid-row:1; } .cal-section { grid-column:1; grid-row:2; position:static; } }
</style>
