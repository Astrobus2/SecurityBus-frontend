import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const baseTitle = 'SecurityBus | UrbanGuard'

// Carga diferida (lazy) de cada vista
const conductorRoutes: RouteRecordRaw[] = [
  { path: 'login', component: () => import('@/conductor/presentation/views/Login.vue') },
  { path: 'qr-scanner', component: () => import('@/conductor/presentation/views/QrScanner.vue') },
  { path: 'access-authorized', component: () => import('@/conductor/presentation/views/AccessAuthorized.vue') },
  { path: 'panic-alert', component: () => import('@/conductor/presentation/views/PanicAlert.vue') },
  {
    path: '',
    component: () => import('@/conductor/presentation/components/ConductorLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('@/conductor/presentation/views/Dashboard.vue') },
      { path: 'admin', redirect: '/admin' },
      { path: 'view-map', component: () => import('@/conductor/presentation/views/ViewMap.vue') },
      { path: 'service-summary', component: () => import('@/conductor/presentation/views/ServiceSummary.vue') },
      { path: 'passengers', component: () => import('@/conductor/presentation/views/PassengerCount.vue') },
      { path: 'api-console', component: () => import('@/conductor/presentation/views/ApiConsole.vue') },
      { path: 'alert-logs', component: () => import('@/conductor/presentation/views/AlertLogs.vue') },
      { path: '', redirect: '/conductor/dashboard' },
    ],
  },
]

const administrationRoutes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('@/administration/presentation/components/AdminLayout.vue'),
    children: [
      { path: 'control-center', component: () => import('@/administration/presentation/views/ControlCenter.vue') },
      { path: 'drivers', component: () => import('@/administration/presentation/views/DriverManagement.vue') },
      { path: 'units', component: () => import('@/administration/presentation/views/UnitAssignment.vue') },
      { path: 'notifications', component: () => import('@/administration/presentation/views/Notifications.vue') },
      { path: 'shifts', component: () => import('@/administration/presentation/views/ShiftHistory.vue') },
      { path: 'impact', component: () => import('@/administration/presentation/views/ImpactNumbers.vue') },
      { path: '', redirect: '/admin/control-center' },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/conductor', meta: { title: `${baseTitle} - Conductor` }, children: conductorRoutes },
    { path: '/admin', meta: { title: `${baseTitle} - Administración` }, children: administrationRoutes },
    { path: '/', redirect: '/conductor/login' },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/shared/presentation/views/PageNotFound.vue'),
      meta: { title: `${baseTitle} - Not Found` },
    },
  ],
})

router.afterEach((to) => {
  const match = [...to.matched].reverse().find((r) => r.meta.title)
  document.title = (match?.meta.title as string | undefined) ?? baseTitle
})
