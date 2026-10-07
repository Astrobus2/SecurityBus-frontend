<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '@/shared/presentation/components/AppIcon.vue'
import { useConductor } from '@/conductor/presentation/state/useConductor'
import { conductorUseCases } from '@/conductor/infrastructure/container'
import type { RegistroPasajeros } from '@/conductor/domain/model/RegistroPasajeros'
import { formatClock } from '@/shared/presentation/format'

const state = useConductor()

const totalAbordo = ref(0)
const totalAbordaron = ref(0)
const totalBajaron = ref(0)
const anomalia = ref(false)
const historial = ref<RegistroPasajeros[]>([])
const capacidadMax = ref(80)

let entradaTimer: ReturnType<typeof setInterval> | null = null

const ocupacionPct = computed(() =>
  Math.min(100, Math.round((totalAbordo.value / capacidadMax.value) * 100)),
)

onMounted(() => {
  totalAbordo.value = state.pasajeros

  // Carga el historial desde la API
  conductorUseCases.consultarRegistrosPasajeros
    .execute(5)
    .then((lista) => (historial.value = lista))
    .catch(() => {})

  // Simula cambios de pasajeros en tiempo real
  entradaTimer = setInterval(() => {
    const entradas = Math.floor(Math.random() * 4)
    const salidas = Math.floor(Math.random() * 3)
    totalAbordaron.value += entradas
    totalBajaron.value += salidas
    const nuevo = Math.max(0, totalAbordo.value + entradas - salidas)
    totalAbordo.value = nuevo
    anomalia.value = nuevo > capacidadMax.value * 0.9
    state.registrarPasajeros(nuevo)
  }, 8000)
})

onBeforeUnmount(() => {
  if (entradaTimer) clearInterval(entradaTimer)
})
</script>

<template>
  <div class="pc-root">
    <div class="pc-header">
      <h2 class="pc-title">CONTEO DE PASAJEROS</h2>
      <p class="pc-sub">Monitoreo automático en tiempo real — BUS-7729</p>
    </div>

    <!-- Main counter -->
    <div class="pc-main-grid">
      <div class="pc-big-card" :class="{ 'pc-alert': anomalia }">
        <div class="pc-big-icon">
          <AppIcon>groups</AppIcon>
        </div>
        <div class="pc-big-val">{{ totalAbordo }}</div>
        <div class="pc-big-label">PASAJEROS A BORDO</div>
        <div v-if="anomalia" class="pc-anomalia-badge">
          <AppIcon>warning</AppIcon> ANOMALÍA DETECTADA
        </div>
      </div>

      <!-- Stats cards -->
      <div class="pc-stats-col">
        <div class="pc-stat-card">
          <AppIcon class="stat-icon green">arrow_downward</AppIcon>
          <div>
            <div class="pc-stat-val">{{ totalAbordaron }}</div>
            <div class="sb-label">TOTAL ABORDARON</div>
          </div>
        </div>
        <div class="pc-stat-card">
          <AppIcon class="stat-icon red">arrow_upward</AppIcon>
          <div>
            <div class="pc-stat-val">{{ totalBajaron }}</div>
            <div class="sb-label">TOTAL BAJARON</div>
          </div>
        </div>
        <div class="pc-stat-card">
          <AppIcon class="stat-icon">event_seat</AppIcon>
          <div>
            <div class="pc-stat-val">{{ capacidadMax }}</div>
            <div class="sb-label">CAPACIDAD MÁX.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ocupación bar -->
    <div class="sb-card ocupacion-card">
      <div class="ocupacion-header">
        <span class="sb-label">NIVEL DE OCUPACIÓN</span>
        <span class="ocupacion-pct" :class="{ high: ocupacionPct > 89 }">{{ ocupacionPct }}%</span>
      </div>
      <div class="ocupacion-bar-bg">
        <div
          class="ocupacion-bar-fill"
          :style="{ width: ocupacionPct + '%' }"
          :class="{ 'fill-warn': ocupacionPct > 75, 'fill-danger': ocupacionPct > 89 }"
        ></div>
      </div>
      <div class="ocupacion-labels">
        <span>0</span>
        <span>{{ capacidadMax / 2 }}</span>
        <span>{{ capacidadMax }}</span>
      </div>
    </div>

    <!-- Status indicators -->
    <div class="pc-status-row">
      <div class="pc-status-item">
        <span class="dot-pulse"></span>
        <span class="sb-label">IA ACTIVA</span>
      </div>
      <div class="pc-status-item">
        <AppIcon class="tiny-icon">sensors</AppIcon>
        <span class="sb-label">SENSORES: ONLINE</span>
      </div>
      <div class="pc-status-item">
        <AppIcon class="tiny-icon">cloud_sync</AppIcon>
        <span class="sb-label">CLOUD: SINCRONIZADO</span>
      </div>
      <div class="pc-status-item" :class="{ 'anomalia-status': anomalia }">
        <AppIcon class="tiny-icon">{{ anomalia ? 'warning' : 'check_circle' }}</AppIcon>
        <span class="sb-label">{{ anomalia ? 'ANOMALÍA' : 'NORMAL' }}</span>
      </div>
    </div>

    <!-- History table -->
    <div class="sb-card hist-card">
      <p class="section-label">ÚLTIMOS REGISTROS</p>
      <p v-if="historial.length === 0" class="no-data">Sin registros históricos disponibles.</p>
      <div v-else class="hist-table">
        <div class="hist-header">
          <span>TIMESTAMP</span>
          <span>A BORDO</span>
          <span>SUBIERON</span>
          <span>BAJARON</span>
          <span>ESTADO</span>
        </div>
        <div v-for="h in historial" :key="h.id" class="hist-row">
          <span class="hist-mono">{{ formatClock(h.timestamp) }}</span>
          <span class="hist-val accent">{{ h.totalAbordo }}</span>
          <span class="hist-val">{{ h.totalAbordaron }}</span>
          <span class="hist-val">{{ h.totalBajaron }}</span>
          <span class="hist-estado" :class="{ alerta: h.anomalia }">
            {{ h.anomalia ? 'ANOMALÍA' : 'NORMAL' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pc-root { padding: 20px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; height: calc(100vh - 48px); }
.pc-header { margin-bottom: 4px; }
.pc-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:22px; color:var(--sb-white); }
.pc-sub { font-size:12px; color:var(--sb-gray); margin-top:4px; }
.pc-main-grid { display:grid; grid-template-columns:1fr 280px; gap:16px; }
.pc-big-card { background:var(--sb-bg-card); border:1px solid var(--sb-border); padding:40px 32px; text-align:center; transition:border-color 0.3s; }
.pc-big-card.pc-alert { border-color:var(--sb-red); animation:flashBorder 1s infinite; }
@keyframes flashBorder { 0%,100%{border-color:var(--sb-red)} 50%{border-color:rgba(232,0,42,0.3)} }
.pc-big-icon .app-icon { font-size:56px; width:56px; height:56px; color:var(--sb-accent); }
.pc-big-val { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:96px; color:var(--sb-accent); line-height:1; margin:16px 0 8px; }
.pc-big-label { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:12px; letter-spacing:0.2em; color:var(--sb-gray); }
.pc-anomalia-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(232,0,42,0.15); border:1px solid var(--sb-red); color:var(--sb-red); font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:11px; letter-spacing:0.15em; padding:6px 14px; margin-top:16px; }
.pc-anomalia-badge .app-icon { font-size:16px; width:16px; height:16px; }
.pc-stats-col { display:flex; flex-direction:column; gap:10px; }
.pc-stat-card { background:var(--sb-bg-card); border:1px solid var(--sb-border); padding:18px 16px; display:flex; align-items:center; gap:14px; flex:1; }
.stat-icon { font-size:28px; width:28px; height:28px; color:var(--sb-gray); }
.stat-icon.green { color:var(--sb-accent); }
.stat-icon.red { color:var(--sb-red); }
.pc-stat-val { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:32px; color:var(--sb-white); line-height:1; margin-bottom:4px; }
.ocupacion-card { }
.ocupacion-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.ocupacion-pct { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:24px; color:var(--sb-accent); }
.ocupacion-pct.high { color:var(--sb-red); }
.ocupacion-bar-bg { height:16px; background:var(--sb-bg-card2); border:1px solid var(--sb-border2); overflow:hidden; margin-bottom:6px; }
.ocupacion-bar-fill { height:100%; background:var(--sb-accent); transition:width 0.5s ease,background 0.3s; }
.ocupacion-bar-fill.fill-warn { background:#f0a000; }
.ocupacion-bar-fill.fill-danger { background:var(--sb-red); }
.ocupacion-labels { display:flex; justify-content:space-between; font-size:10px; color:var(--sb-gray2); }
.pc-status-row { display:flex; gap:16px; flex-wrap:wrap; }
.pc-status-item { display:flex; align-items:center; gap:8px; background:var(--sb-bg-card); border:1px solid var(--sb-border); padding:8px 14px; }
.pc-status-item.anomalia-status { border-color:var(--sb-red); }
.dot-pulse { width:8px; height:8px; background:var(--sb-accent); border-radius:50%; animation:pulse 1.5s infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
.tiny-icon { font-size:16px; width:16px; height:16px; color:var(--sb-accent); }
.anomalia-status .tiny-icon { color:var(--sb-red); }
.hist-card { }
.section-label { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:11px; letter-spacing:0.2em; color:var(--sb-gray); text-transform:uppercase; margin-bottom:14px; }
.no-data { font-size:13px; color:var(--sb-gray2); padding:16px 0; }
.hist-table { }
.hist-header,.hist-row { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1fr; padding:8px 12px; border-bottom:1px solid var(--sb-border); align-items:center; gap:8px; }
.hist-header { background:var(--sb-bg-card2); }
.hist-header span { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:10px; letter-spacing:0.15em; color:var(--sb-gray); }
.hist-mono { font-family:'Share Tech Mono',monospace; font-size:11px; color:var(--sb-gray); }
.hist-val { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; color:var(--sb-white); }
.hist-val.accent { color:var(--sb-accent); }
.hist-estado { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:11px; color:var(--sb-accent); }
.hist-estado.alerta { color:var(--sb-red); }
</style>
