<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '@/shared/presentation/components/AppIcon.vue'

const recipients = ref([
  { id: 1, name: 'Central PNP Lima Norte', type: 'POLICÍA', icon: 'local_police', active: true },
  { id: 2, name: 'Central SecurityBus OPS', type: 'OPERACIONES', icon: 'headset_mic', active: true },
  { id: 3, name: 'Empresa Trans Lima SAC', type: 'EMPRESA', icon: 'business', active: true },
  { id: 4, name: 'Gerencia Operativa', type: 'GESTIÓN', icon: 'manage_accounts', active: false },
])
const notifs = ref([
  { id: 1, tipo: 'PÁNICO', mensaje: 'Alerta de pánico enviada — GHI-9012', hora: '07:05', bus: 'GHI-9012', entregado: true },
  { id: 2, tipo: 'VELOCIDAD', mensaje: 'Velocidad excesiva detectada — GHI-9012', hora: '07:02', bus: 'GHI-9012', entregado: true },
  { id: 3, tipo: 'PASAJEROS', mensaje: 'Sobrecapacidad detectada — GHI-9012', hora: '07:30', bus: 'GHI-9012', entregado: false },
  { id: 4, tipo: 'DESVÍO', mensaje: 'Desvío de ruta resuelto — ABC-1234', hora: '06:50', bus: 'ABC-1234', entregado: true },
])
</script>

<template>
  <div class="notif-root">
    <h2 class="page-title">NOTIFICACIONES</h2>
    <div class="notif-grid">
      <div class="sb-card">
        <p class="section-label">DESTINATARIOS ACTIVOS</p>
        <div v-for="r in recipients" :key="r.id" class="recip-row">
          <AppIcon :style="{ color: r.active ? 'var(--sb-accent)' : 'var(--sb-gray)' }">{{ r.icon }}</AppIcon>
          <div class="recip-info">
            <p class="recip-name">{{ r.name }}</p>
            <p class="recip-type">{{ r.type }}</p>
          </div>
          <span class="recip-status" :style="{ color: r.active ? 'var(--sb-accent)' : 'var(--sb-gray)' }">
            {{ r.active ? 'ACTIVO' : 'INACTIVO' }}
          </span>
        </div>
      </div>
      <div class="sb-card">
        <p class="section-label">REGISTRO DE ENTREGAS</p>
        <div v-for="n in notifs" :key="n.id" class="notif-row">
          <div class="notif-dot" :style="{ background: n.tipo === 'PÁNICO' ? 'var(--sb-red)' : 'var(--sb-accent)' }"></div>
          <div>
            <p class="notif-msg">{{ n.mensaje }}</p>
            <p class="notif-hora">{{ n.hora }} — {{ n.bus }}</p>
          </div>
          <AppIcon :style="{ color: n.entregado ? 'var(--sb-accent)' : 'var(--sb-gray)' }">
            {{ n.entregado ? 'check_circle' : 'pending' }}
          </AppIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notif-root { padding: 20px; }
.page-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:22px; color:var(--sb-white); margin-bottom:20px; }
.notif-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.section-label { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:11px; letter-spacing:0.2em; color:var(--sb-gray); text-transform:uppercase; margin-bottom:14px; }
.recip-row,.notif-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--sb-border); }
.recip-row:last-child,.notif-row:last-child { border-bottom:none; }
.recip-row .app-icon { font-size:22px; width:22px; height:22px; }
.recip-info { flex:1; }
.recip-name { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; color:var(--sb-white); }
.recip-type { font-size:11px; color:var(--sb-gray); }
.recip-status { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:10px; }
.notif-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.notif-msg { font-size:12px; color:var(--sb-white); flex:1; }
.notif-hora { font-size:10px; color:var(--sb-gray); }
</style>
