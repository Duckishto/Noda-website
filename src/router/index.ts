import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/auth/handoff',
      name: 'handoff',
      component: () => import('@/views/HandoffView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/views/AppShell.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '',              name: 'home',          component: () => import('@/views/HomeView.vue') },
        { path: 'knowledge',     name: 'knowledge',     component: () => import('@/views/KnowledgeView.vue') },
        { path: 'create',        name: 'create',        component: () => import('@/views/CreateView.vue') },
        { path: 'posts/:id',     name: 'post-detail',   component: () => import('@/views/PostDetailView.vue') },
        { path: 'announcements', name: 'announcements', component: () => import('@/views/AnnouncementsView.vue') },
        { path: 'members',       name: 'members',       component: () => import('@/views/MembersView.vue') },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue'),
          meta: { requiresAdmin: true },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const auth     = useAuthStore()
  const skipAuth = import.meta.env.VITE_SKIP_AUTH === 'true'

  if (skipAuth) return

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'home' }
  }
  // ถ้า login แล้ว ไม่ให้กลับหน้า login/register
  if ((to.name === 'login' || to.name === 'register') && auth.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
