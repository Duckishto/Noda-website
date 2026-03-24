<template>
  <div class="empty-wrap">

    <!-- SVG Illustration -->
    <div class="empty-art">
      <!-- Posts empty: sleeping cat on a log -->
      <svg v-if="type === 'posts' || type === 'knowledge'" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" class="empty-svg">
        <!-- Ground / log -->
        <ellipse cx="120" cy="138" rx="80" ry="14" fill="#D6EEB8" />
        <rect x="52" y="124" width="136" height="20" rx="10" fill="#8B5E3C" />
        <rect x="56" y="126" width="128" height="8" rx="4" fill="#A0714A" />

        <!-- Cat body -->
        <ellipse cx="120" cy="112" rx="34" ry="20" fill="#F5C27A" />

        <!-- Cat head -->
        <circle cx="152" cy="102" r="18" fill="#F5C27A" />

        <!-- Cat ears -->
        <polygon points="142,88 148,75 155,88" fill="#F5C27A" />
        <polygon points="156,88 162,75 168,88" fill="#F5C27A" />
        <polygon points="144,88 148,79 153,88" fill="#F0A0A0" />
        <polygon points="158,88 162,79 166,88" fill="#F0A0A0" />

        <!-- Cat face - sleeping -->
        <path d="M146 104 Q148 107 151 104" stroke="#7A4520" stroke-width="1.5" fill="none" stroke-linecap="round" />
        <path d="M153 104 Q156 107 159 104" stroke="#7A4520" stroke-width="1.5" fill="none" stroke-linecap="round" />

        <!-- Closed eyes ZZZ -->
        <path d="M145 98 Q148 96 151 98" stroke="#7A4520" stroke-width="1.5" fill="none" stroke-linecap="round" />
        <path d="M153 98 Q156 96 159 98" stroke="#7A4520" stroke-width="1.5" fill="none" stroke-linecap="round" />

        <!-- Tail -->
        <path d="M88 118 Q68 108 72 92 Q76 78 88 82" stroke="#F5C27A" stroke-width="8" fill="none" stroke-linecap="round" />

        <!-- ZZZ bubbles -->
        <text x="172" y="86" font-size="11" fill="#B87340" font-weight="600" opacity="0.7">z</text>
        <text x="182" y="76" font-size="13" fill="#B87340" font-weight="600" opacity="0.5">z</text>
        <text x="192" y="64" font-size="15" fill="#B87340" font-weight="600" opacity="0.3">z</text>

        <!-- Floating leaves -->
        <ellipse cx="58" cy="100" rx="7" ry="4" fill="#7BB84A" opacity="0.5" transform="rotate(-30 58 100)" />
        <ellipse cx="40" cy="115" rx="5" ry="3" fill="#4A7C2F" opacity="0.4" transform="rotate(20 40 115)" />
      </svg>

      <!-- Announcements empty: empty notice board -->
      <svg v-else-if="type === 'announcements'" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" class="empty-svg">
        <!-- Board frame -->
        <rect x="40" y="30" width="160" height="110" rx="8" fill="#8B5E3C" />
        <rect x="46" y="36" width="148" height="98" rx="5" fill="#FDE9D4" />
        <!-- Pin -->
        <circle cx="120" cy="36" r="6" fill="#A84E10" />
        <circle cx="120" cy="36" r="3" fill="#FDE9D4" />
        <!-- Empty lines -->
        <rect x="62" y="60" width="116" height="8" rx="4" fill="#E0D0B8" opacity="0.6" />
        <rect x="62" y="76" width="90" height="8" rx="4" fill="#E0D0B8" opacity="0.4" />
        <rect x="62" y="92" width="106" height="8" rx="4" fill="#E0D0B8" opacity="0.3" />
        <!-- Tumbleweeds / dust -->
        <circle cx="80" cy="118" r="8" fill="none" stroke="#C8B89A" stroke-width="1.5" opacity="0.5" />
        <circle cx="78" cy="116" r="5" fill="none" stroke="#C8B89A" stroke-width="1" opacity="0.4" />
        <circle cx="160" cy="122" r="6" fill="none" stroke="#C8B89A" stroke-width="1.5" opacity="0.4" />
        <!-- Question mark -->
        <text x="108" y="116" font-size="22" fill="#D8C9B0" font-weight="700">?</text>
      </svg>

      <!-- Members search empty: magnifier with nothing -->
      <svg v-else-if="type === 'members' || type === 'search'" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" class="empty-svg">
        <circle cx="105" cy="85" r="44" fill="none" stroke="#D8C9B0" stroke-width="10" />
        <circle cx="105" cy="85" r="34" fill="#F5EAD8" />
        <line x1="138" y1="118" x2="168" y2="148" stroke="#D8C9B0" stroke-width="10" stroke-linecap="round" />
        <!-- Sad face inside lens -->
        <circle cx="95" cy="82" r="3" fill="#C8B89A" />
        <circle cx="115" cy="82" r="3" fill="#C8B89A" />
        <path d="M93 96 Q105 90 117 96" stroke="#C8B89A" stroke-width="2" fill="none" stroke-linecap="round" />
      </svg>
    </div>

    <!-- Text -->
    <div class="empty-text">
      <div class="empty-title">{{ config.title }}</div>
      <div class="empty-desc">{{ config.desc }}</div>
    </div>

    <!-- CTA Button -->
    <button v-if="config.action" class="empty-cta" @click="$emit('action')">
      {{ config.action }}
    </button>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: 'posts' | 'knowledge' | 'announcements' | 'members' | 'search'
}>()

defineEmits(['action'])

const configs = {
  posts: {
    title:  'เงียบเหงาจังเลยนะ...',
    desc:   'ยังไม่มีชิ้นงานในหมวดนี้ โพสต์อะไรหน่อยสิ ความรู้ของชุมชนรอให้ใครบันทึกอยู่',
    action: '+ เริ่มสร้างชิ้นงานแรก',
  },
  knowledge: {
    title:  'คลังยังว่างเปล่าอยู่เลย',
    desc:   'ความรู้ท้องถิ่นรอให้ใครสักคนเก็บรักษา ก่อนที่มันจะหายไปตามกาลเวลา',
    action: undefined,
  },
  announcements: {
    title:  'ป้ายประกาศยังว่างอยู่',
    desc:   'ชุมชนเงียบสงบดีเหมือนกัน ถ้ามีข่าวสารอะไรก็เพิ่มประกาศได้เลยครับ',
    action: undefined,
  },
  members: {
    title:  'หาไม่เจอเลย',
    desc:   'ไม่พบสมาชิกที่ตรงกับที่ค้นหา ลองตรวจสอบการสะกดอีกครั้ง',
    action: undefined,
  },
  search: {
    title:  'ไม่พบสิ่งที่ค้นหา',
    desc:   'ลองใช้คำอื่น หรือตรวจสอบการสะกด',
    action: undefined,
  },
}

const config = computed(() => configs[props.type])
</script>

<style scoped>
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 40px 24px;
  text-align: center;
  animation: fadeUp 0.35s ease;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.empty-art { margin-bottom: 4px; }
.empty-svg {
  width: 200px;
  height: auto;
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
}

.empty-text   { max-width: 280px; }
.empty-title  {
  font-size: 17px;
  font-weight: 700;
  color: var(--brown-800);
  margin-bottom: 8px;
  font-family: 'Noto Serif Thai', serif;
  line-height: 1.4;
}
.empty-desc {
  font-size: 13.5px;
  color: var(--brown-400);
  line-height: 1.7;
}

.empty-cta {
  margin-top: 6px;
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background: var(--green-dark);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Sarabun', sans-serif;
  transition: all 0.15s;
}
.empty-cta:hover {
  background: #245016;
  transform: translateY(-1px);
}
</style>
