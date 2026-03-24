<template>
  <div class="login-page">
    <!-- ── Background blobs ── -->
    <div class="blob blob-1" />
    <div class="blob blob-2" />
    <div class="blob blob-3" />
    <div class="noise" />

    <!-- ── Network pattern ── -->
    <svg
      class="bg-net"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="180" cy="120" r="3.5" fill="rgba(123,184,74,0.55)" />
      <circle cx="720" cy="200" r="5" fill="rgba(123,184,74,0.4)" />
      <circle cx="1260" cy="140" r="3" fill="rgba(123,184,74,0.55)" />
      <circle cx="300" cy="500" r="4" fill="rgba(123,184,74,0.45)" />
      <circle cx="1100" cy="580" r="6" fill="rgba(123,184,74,0.35)" />
      <circle cx="900" cy="760" r="3.5" fill="rgba(123,184,74,0.45)" />
      <circle cx="140" cy="750" r="4" fill="rgba(123,184,74,0.4)" />
      <circle cx="1380" cy="680" r="3" fill="rgba(123,184,74,0.5)" />
      <circle cx="540" cy="340" r="2.5" fill="rgba(183,115,64,0.4)" />
      <circle cx="980" cy="420" r="3" fill="rgba(183,115,64,0.35)" />
      <line x1="180" y1="120" x2="720" y2="200" stroke="rgba(123,184,74,0.2)" stroke-width="1.2" />
      <line x1="720" y1="200" x2="1260" y2="140" stroke="rgba(123,184,74,0.16)" stroke-width="1" />
      <line x1="720" y1="200" x2="300" y2="500" stroke="rgba(123,184,74,0.16)" stroke-width="1" />
      <line x1="720" y1="200" x2="1100" y2="580" stroke="rgba(123,184,74,0.14)" stroke-width="1" />
      <line x1="300" y1="500" x2="140" y2="750" stroke="rgba(123,184,74,0.14)" stroke-width="1" />
      <line x1="1100" y1="580" x2="900" y2="760" stroke="rgba(123,184,74,0.14)" stroke-width="1" />
      <line x1="1100" y1="580" x2="1380" y2="680" stroke="rgba(123,184,74,0.14)" stroke-width="1" />
      <line x1="180" y1="120" x2="540" y2="340" stroke="rgba(123,184,74,0.12)" stroke-width="1" />
      <line x1="540" y1="340" x2="720" y2="200" stroke="rgba(123,184,74,0.12)" stroke-width="1" />
      <line x1="540" y1="340" x2="300" y2="500" stroke="rgba(123,184,74,0.11)" stroke-width="1" />
      <line x1="980" y1="420" x2="720" y2="200" stroke="rgba(183,115,64,0.12)" stroke-width="1" />
      <line x1="980" y1="420" x2="1100" y2="580" stroke="rgba(183,115,64,0.12)" stroke-width="1" />
      <line
        x1="1260"
        y1="140"
        x2="1380"
        y2="680"
        stroke="rgba(255,255,255,0.05)"
        stroke-width="1"
      />
      <line x1="180" y1="120" x2="140" y2="750" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    </svg>

    <!-- ── Watermark logo ── -->
    <div class="bg-logo-wrap">
      <img src="@/assets/logo.png" alt="" class="bg-logo" />
    </div>

    <!-- ── Particles ── -->
    <canvas ref="canvasEl" class="particles-canvas" />

    <!-- ── Card ── -->
    <div class="card" :class="{ 'card-in': cardVisible }">
      <div class="card-top-bar" />
      <div class="card-inner">
        <!-- Header -->
        <div class="card-header">
          <img src="@/assets/logo.png" alt="Noda" class="card-logo" />
          <div v-if="communityName" class="comm-badge">
            <span class="comm-dot" />{{ communityName }}
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" class="card-form">
          <div class="field" :class="{ 'field-active': focusName }">
            <label class="field-label">ชื่อ-นามสกุล</label>
            <div class="field-box">
              <svg class="field-icon" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.6" />
                <path
                  d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
              <input
                v-model="form.name"
                type="text"
                class="field-input"
                placeholder="สมชาย ใจดี"
                required
                @focus="focusName = true"
                @blur="focusName = false"
              />
            </div>
          </div>

          <div class="field" :class="{ 'field-active': focusEmail }">
            <label class="field-label">อีเมล</label>
            <div class="field-box">
              <svg class="field-icon" viewBox="0 0 20 20" fill="none">
                <path
                  d="M2.5 6.5l7.5 5 7.5-5M2.5 5h15a1 1 0 011 1v8a1 1 0 01-1 1h-15a1 1 0 01-1-1V6a1 1 0 011-1z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <input
                v-model="form.email"
                type="email"
                class="field-input"
                placeholder="you@example.com"
                required
                @focus="focusEmail = true"
                @blur="focusEmail = false"
              />
            </div>
          </div>

          <div class="field" :class="{ 'field-active': focusPass }">
            <label class="field-label">รหัสผ่าน</label>
            <div class="field-box">
              <svg class="field-icon" viewBox="0 0 20 20" fill="none">
                <rect
                  x="4"
                  y="9"
                  width="12"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
                <path
                  d="M7 9V6.5a3 3 0 016 0V9"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
                <circle cx="10" cy="13.5" r="1.2" fill="currentColor" />
              </svg>
              <input
                v-model="form.password"
                type="password"
                class="field-input"
                placeholder="อย่างน้อย 6 ตัวอักษร"
                required
                minlength="6"
                @focus="focusPass = true"
                @blur="focusPass = false"
              />
            </div>
          </div>

          <Transition name="err">
            <div v-if="error" class="error-msg">
              <svg viewBox="0 0 20 20" fill="none" width="16" height="16" style="flex-shrink: 0">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" />
                <path
                  d="M10 6v4m0 3h.01"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              {{ error }}
            </div>
          </Transition>

          <button
            type="submit"
            class="btn-login"
            :disabled="isLoading"
            :class="{ loading: isLoading }"
          >
            <span class="btn-shine" />
            <span v-if="isLoading" class="btn-spin" />
            <span v-else>สมัครสมาชิก</span>
          </button>
        </form>

        <div class="card-divider"><span>มีบัญชีอยู่แล้ว?</span></div>
        <router-link to="/login" class="btn-register">เข้าสู่ระบบ</router-link>

        <p class="card-footer">ระบบออนไลน์ 24 ชั่วโมง</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import client from '@/api/client'

const router = useRouter()
const authStore = useAuthStore()

const communityId = import.meta.env.VITE_COMMUNITY_ID as string
const communityName = import.meta.env.VITE_COMMUNITY_NAME as string | undefined

const form = ref({ name: '', email: '', password: '' })
const error = ref('')
const isLoading = ref(false)
const focusName = ref(false)
const focusEmail = ref(false)
const focusPass = ref(false)
const cardVisible = ref(false)
const canvasEl = ref<HTMLCanvasElement | null>(null)

// ── Particle system ──
const COLORS = ['123,184,74', '74,124,47', '183,115,64', '255,220,120'] as const
type DotColor = (typeof COLORS)[number]

interface Dot {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  alpha: number
  baseAlpha: number
  color: DotColor
  pulse: number
  pulseSpeed: number
}

function randColor(): DotColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)] as DotColor
}

let raf = 0

function initParticles() {
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  let W = (canvas.width = window.innerWidth)
  let H = (canvas.height = window.innerHeight)

  const dots: Dot[] = Array.from({ length: 70 }, () => {
    const baseAlpha = Math.random() * 0.35 + 0.1
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2.5 + 0.8,
      alpha: baseAlpha,
      baseAlpha,
      color: randColor(),
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    } satisfies Dot
  })

  function draw() {
    ctx.clearRect(0, 0, W, H)
    dots.forEach((a, i) => {
      dots.slice(i + 1).forEach((b) => {
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 110) {
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(123,184,74,${0.07 * (1 - dist / 110)})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      })
    })
    dots.forEach((d) => {
      d.x += d.vx
      d.y += d.vy
      if (d.x < 0) d.x = W
      if (d.x > W) d.x = 0
      if (d.y < 0) d.y = H
      if (d.y > H) d.y = 0
      d.pulse += d.pulseSpeed
      d.alpha = d.baseAlpha + Math.sin(d.pulse) * 0.12
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${d.color},${d.alpha})`
      ctx.fill()
      if (d.r > 2) {
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${d.color},${d.alpha * 0.15})`
        ctx.fill()
      }
    })
    raf = requestAnimationFrame(draw)
  }
  draw()

  const onResize = () => {
    W = canvas.width = window.innerWidth
    H = canvas.height = window.innerHeight
  }
  window.addEventListener('resize', onResize)
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    cancelAnimationFrame(raf)
  })
}

onMounted(() => {
  setTimeout(() => {
    cardVisible.value = true
  }, 80)
  initParticles()
})

async function handleRegister() {
  if (!communityId) {
    error.value = 'ไม่พบ VITE_COMMUNITY_ID — กรุณาตั้งค่า .env'
    return
  }
  error.value = ''
  isLoading.value = true
  try {
    const res = await client.post('/auth/register', { ...form.value, communityId })
    const { token, user } = res.data
    authStore.token = token
    authStore.user = user
    localStorage.setItem('noda_token', token)
    router.push('/')
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ════ PAGE — identical to LoginView ════ */
.login-page {
  min-height: 100vh;
  background: var(--brown-900);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 24px 16px;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  will-change: transform;
}
.blob-1 {
  width: 700px;
  height: 700px;
  top: -220px;
  left: -180px;
  background: radial-gradient(circle, rgba(74, 124, 47, 0.4), transparent 70%);
  animation: blob1 20s ease-in-out infinite;
}
.blob-2 {
  width: 600px;
  height: 600px;
  bottom: -180px;
  right: -160px;
  background: radial-gradient(circle, rgba(74, 124, 47, 0.3), transparent 70%);
  animation: blob2 25s ease-in-out infinite;
}
.blob-3 {
  width: 350px;
  height: 350px;
  top: 50%;
  left: 42%;
  background: radial-gradient(circle, rgba(183, 115, 64, 0.15), transparent 70%);
  animation: blob3 17s ease-in-out infinite;
}
@keyframes blob1 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  40% {
    transform: translate(100px, 70px);
  }
  70% {
    transform: translate(-50px, 120px);
  }
}
@keyframes blob2 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  35% {
    transform: translate(-90px, -60px);
  }
  65% {
    transform: translate(70px, -100px);
  }
}
@keyframes blob3 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-70px, 60px) scale(1.2);
  }
}

.noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
}

.particles-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}
.bg-net {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.bg-logo-wrap {
  position: absolute;
  bottom: -60px;
  right: -60px;
  z-index: 1;
  pointer-events: none;
}
.bg-logo {
  width: 420px;
  height: auto;
  opacity: 0.06;
  mix-blend-mode: luminosity;
  filter: grayscale(1);
  animation: bg-float 8s ease-in-out infinite;
}
@keyframes bg-float {
  0%,
  100% {
    transform: translateY(0) rotate(-6deg);
  }
  50% {
    transform: translateY(-18px) rotate(-6deg);
  }
}

/* ════ CARD ════ */
.card {
  position: relative;
  z-index: 20;
  width: 100%;
  max-width: 500px;
  background: rgba(253, 246, 238, 0.97);
  backdrop-filter: blur(28px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 48px 120px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 2px 0 rgba(255, 255, 255, 0.3) inset;
  overflow: hidden;
  opacity: 0;
  transform: translateY(28px) scale(0.97);
  transition:
    opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
.card.card-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.card-top-bar {
  height: 4px;
  background: linear-gradient(90deg, #2d5a1b, #7bb84a, #e8a830, #7bb84a, #2d5a1b);
  background-size: 300% 100%;
  animation: bar 5s ease infinite;
}
@keyframes bar {
  0%,
  100% {
    background-position: 0%;
  }
  50% {
    background-position: 100%;
  }
}

.card-inner {
  padding: 44px 52px 40px;
}

/* ── Header ── */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.card-logo {
  width: 180px;
  height: auto;
  display: block;
  mix-blend-mode: multiply;
  margin: 0 auto 10px;
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

.card-tagline {
  font-size: 16px;
  color: var(--brown-500);
  margin: 0 0 14px;
}

.comm-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px;
  border-radius: 100px;
  background: var(--green-bg);
  border: 1px solid #c0dda8;
  font-size: 13px;
  color: var(--green-dark);
  font-weight: 500;
}
.comm-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green-mid);
  flex-shrink: 0;
  animation: dot 2s infinite;
}
@keyframes dot {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.85);
  }
}

/* ── Form ── */
.card-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--brown-800);
  letter-spacing: 0.3px;
  transition: color 0.2s;
}
.field-active .field-label {
  color: var(--green-dark);
}

.field-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 2px solid #cfc0a8;
  border-radius: 14px;
  padding: 0 18px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.18s;
}
.field-active .field-box {
  border-color: var(--green-dark);
  box-shadow: 0 0 0 4px rgba(45, 90, 27, 0.12);
  transform: translateY(-1px);
}

.field-icon {
  width: 19px;
  height: 19px;
  color: var(--brown-500);
  flex-shrink: 0;
  transition: color 0.2s;
}
.field-active .field-icon {
  color: var(--green-dark);
}

.field-input {
  flex: 1;
  border: none;
  background: none;
  padding: 16px 0;
  font-size: 16px;
  font-family: 'Sarabun', sans-serif;
  color: var(--brown-900);
  outline: none;
  font-weight: 500;
}
.field-input::placeholder {
  color: #b8a898;
  font-weight: 400;
}

/* ── Error ── */
.error-msg {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  border-radius: 12px;
  background: var(--tag-orange-bg);
  color: var(--tag-orange);
  font-size: 13.5px;
  border: 1px solid #f5c8a0;
  animation: shake 0.4s ease;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-7px);
  }
  40% {
    transform: translateX(7px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}
.err-enter-active,
.err-leave-active {
  transition: all 0.25s;
}
.err-enter-from,
.err-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Submit btn ── */
.btn-login {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 19px;
  border-radius: 14px;
  border: none;
  background: var(--green-dark);
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  font-family: 'Sarabun', sans-serif;
  cursor: pointer;
  margin-top: 4px;
  letter-spacing: 0.5px;
  transition:
    background 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
  box-shadow: 0 8px 28px rgba(45, 90, 27, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-login::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
}
.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 55%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: skewX(-18deg);
  transition: left 0.55s ease;
}
.btn-login:hover:not(:disabled) .btn-shine {
  left: 160%;
}
.btn-login:hover:not(:disabled) {
  background: #245016;
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(45, 90, 27, 0.55);
}
.btn-login:active:not(:disabled) {
  transform: translateY(0);
}
.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spin {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Divider & back-to-login ── */
.card-divider {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 22px 0;
  color: var(--brown-400);
  font-size: 13px;
}
.card-divider::before,
.card-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5d5c0;
}

.btn-register {
  display: block;
  width: 100%;
  padding: 17px;
  border-radius: 14px;
  border: 2px solid #cfc0a8;
  background: transparent;
  color: var(--brown-700);
  font-size: 15.5px;
  font-weight: 700;
  font-family: 'Sarabun', sans-serif;
  text-align: center;
  text-decoration: none;
  transition:
    border-color 0.2s,
    background 0.2s,
    color 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
}
.btn-register:hover {
  border-color: var(--brown-600);
  background: rgba(255, 255, 255, 0.9);
  color: var(--brown-900);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.card-footer {
  margin-top: 24px;
  font-size: 12px;
  color: var(--brown-400);
  text-align: center;
}

/* ── Responsive ── */
@media (max-width: 560px) {
  .card-inner {
    padding: 36px 28px 32px;
  }
  .card-logo {
    width: 140px;
  }
}
@media (max-width: 380px) {
  .card-inner {
    padding: 28px 18px 26px;
  }
  .field-input {
    font-size: 16px;
  }
}
</style>
