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

    <!-- ── Watermark logo bottom-right ── -->
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
        <form @submit.prevent="handleLogin" class="card-form">
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
                placeholder="••••••••"
                required
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
            <span v-else>เข้าสู่ระบบ</span>
          </button>
        </form>

        <div class="card-divider"><span>ยังไม่มีบัญชี?</span></div>
        <router-link to="/register" class="btn-register">สมัครสมาชิกใหม่</router-link>

        <!-- Social icon buttons -->
        <div class="social-section">
          <div class="social-label">ติดตาม Noda</div>
          <div class="social-row">
            <a href="https://instagram.com" target="_blank" class="social-btn ig" title="Instagram">
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5.5"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="2" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
              </svg>
            </a>
            <a href="https://discord.com" target="_blank" class="social-btn dc" title="Discord">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path
                  d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" class="social-btn fb" title="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </a>
          </div>
        </div>

        <p class="card-footer">ระบบออนไลน์ 24 ชั่วโมง</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const communityId = import.meta.env.VITE_COMMUNITY_ID as string
const communityName = import.meta.env.VITE_COMMUNITY_NAME as string | undefined

const form = ref({ email: '', password: '' })
const error = ref('')
const isLoading = ref(false)
const focusEmail = ref(false)
const focusPass = ref(false)
const cardVisible = ref(false)
const canvasEl = ref<HTMLCanvasElement | null>(null)

let raf = 0
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

    // draw connections
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

    // draw dots
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

async function handleLogin() {
  if (!communityId) {
    error.value = 'ไม่พบ VITE_COMMUNITY_ID'
    return
  }
  error.value = ''
  isLoading.value = true
  try {
    await authStore.login({ ...form.value, communityId })
    router.push('/')
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ════ PAGE ════ */
.login-page {
  min-height: 100vh;
  background: var(--brown-900);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 24px 16px 80px;
}

/* ── Blobs ── */
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

/* ── Noise ── */
.noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
}

/* ── Particles canvas ── */
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

/* ── Watermark logo ── */
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
  animation: bg-logo-float 8s ease-in-out infinite;
}
@keyframes bg-logo-float {
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

/* ── Logo header ── */
.card-header {
  text-align: center;
  margin-bottom: 36px;
}

.card-logo {
  width: 180px;
  height: auto;
  display: block;
  mix-blend-mode: multiply;
  margin: 0 auto 18px;
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
    opacity: 0.5;
    transform: scale(0.85);
  }
}

/* ════ FORM ════ */
.card-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  padding: 17px 0;
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

/* ── Login btn ── */
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
  box-shadow: 0 4px 14px rgba(45, 90, 27, 0.3);
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

/* ════ SOCIAL ════ */
.social-section {
  margin-top: 24px;
}

.social-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--brown-400);
  text-align: center;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.social-row {
  display: flex;
  justify-content: center;
  gap: 14px;
}

.social-btn {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.18s,
    box-shadow 0.18s,
    background 0.2s,
    border-color 0.2s;
}
.social-btn:hover {
  transform: translateY(-3px);
}

.social-btn.ig {
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  color: #fff;
  box-shadow: 0 4px 16px rgba(193, 53, 132, 0.3);
}
.social-btn.ig:hover {
  box-shadow: 0 8px 24px rgba(193, 53, 132, 0.5);
}

.social-btn.dc {
  background: #5865f2;
  color: #fff;
  box-shadow: 0 4px 16px rgba(88, 101, 242, 0.3);
}
.social-btn.dc:hover {
  box-shadow: 0 8px 24px rgba(88, 101, 242, 0.5);
}

.social-btn.fb {
  background: #1877f2;
  color: #fff;
  box-shadow: 0 4px 16px rgba(24, 119, 242, 0.3);
}
.social-btn.fb:hover {
  box-shadow: 0 8px 24px rgba(24, 119, 242, 0.5);
}

/* ── Divider ── */
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

/* ── Register ── */
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

/* ── Stats ── */
.page-stats {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 48px;
  z-index: 10;
}
.page-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  animation: stat-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes stat-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.page-stat-num {
  font-size: 20px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Noto Serif Thai', serif;
  line-height: 1;
}
.page-stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.28);
  letter-spacing: 1px;
}

/* ── Responsive ── */
@media (max-width: 560px) {
  .card-inner {
    padding: 36px 28px 32px;
  }
  .card-logo {
    width: 90px;
  }
  .page-stats {
    gap: 32px;
  }
}
@media (max-width: 380px) {
  .card-inner {
    padding: 28px 18px 26px;
  }
  .field-input {
    font-size: 16px;
  }
  .page-stats {
    display: none;
  }
}
</style>
