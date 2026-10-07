<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/shared/presentation/components/AppIcon.vue'
import { useConductor } from '@/conductor/presentation/state/useConductor'
import { useFlota } from '@/tracking/presentation/state/useFlota'
import { formatNumber } from '@/shared/presentation/format'

const state = useConductor()
const fleet = useFlota()

const misAlertas = computed(() => {
  const codigo = state.conductorActual?.codigoEmpleado
  if (!codigo) return []
  return fleet.alertas.filter((a) => a.codigoEmpleado === codigo)
})

const panicCount = computed(() => misAlertas.value.filter((a) => a.tipo === 'PÁNICO').length)

function nivelColor(nivel: string): string {
  return nivel === 'CRITICO' ? 'var(--sb-red)' : nivel === 'ALTO' ? '#ff6d00' : nivel === 'MEDIO' ? '#f0a000' : 'var(--sb-gray)'
}
</script>

<template>
  <div class="al-root">
    <div class="al-header">
      <h2 class="al-title">ALERT LOGS</h2>
      <p class="al-sub">Registro de alertas enviadas durante el servicio</p>
    </div>

    <div class="al-summary">
      <div class="sum-card">
        <AppIcon style="color: var(--sb-red)">emergency</AppIcon>
        <span class="sum-val" style="color: var(--sb-red)">{{ panicCount }}</span>
        <span class="sb-label">PÁNICO</span>
      </div>
      <div class="sum-card">
        <AppIcon style="color: #ff6d00">speed</AppIcon>
        <span class="sum-val" style="color: #ff6d00">0</span>
        <span class="sb-label">VELOCIDAD</span>
      </div>
      <div class="sum-card">
        <AppIcon style="color: #f0a000">alt_route</AppIcon>
        <span class="sum-val" style="color: #f0a000">0</span>
        <span class="sb-label">DESVÍOS</span>
      </div>
      <div class="sum-card">
        <AppIcon style="color: var(--sb-accent)">people</AppIcon>
        <span class="sum-val" style="color: var(--sb-accent)">0</span>
        <span class="sb-label">PASAJEROS</span>
      </div>
    </div>

    <div class="sb-card al-table-card">
      <p class="section-label">HISTORIAL DE ALERTAS</p>
      <div v-if="misAlertas.length === 0" class="no-alerts">
        <AppIcon>check_circle</AppIcon>
        <p>Sin alertas registradas en este turno</p>
      </div>
      <div v-else class="al-table">
        <div class="al-header-row">
          <span>NIVEL</span><span>TIPO</span><span>DESCRIPCIÓN</span>
          <span>HORA</span><span>COORDS</span><span>ESTADO</span>
        </div>
        <div v-for="a in misAlertas" :key="a.id" class="al-row">
          <span class="nivel-badge" :style="{ color: nivelColor(a.nivel) }">{{ a.nivel }}</span>
          <span class="al-tipo">{{ a.tipo }}</span>
          <span class="al-desc">Alerta #{{ a.id }} — Unidad {{ a.bus }}</span>
          <span class="al-mono">{{ a.hora }}</span>
          <span class="al-mono">{{ formatNumber(a.lat, 4, 4) }}, {{ formatNumber(a.lng, 4, 4) }}</span>
          <span class="al-estado" :class="{ resuelta: a.resuelta }">{{ a.resuelta ? 'RESUELTA' : 'ACTIVA' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.al-root { padding:20px; display:flex; flex-direction:column; gap:16px; height:calc(100vh - 48px); overflow-y:auto; }
.al-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:22px; color:var(--sb-white); }
.al-sub { font-size:12px; color:var(--sb-gray); margin-top:4px; }
.al-summary { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.sum-card { background:var(--sb-bg-card); border:1px solid var(--sb-border); padding:20px 16px; display:flex; flex-direction:column; align-items:center; gap:8px; }
.sum-card .app-icon { font-size:28px; width:28px; height:28px; }
.sum-val { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:36px; line-height:1; }
.section-label { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:11px; letter-spacing:0.2em; color:var(--sb-gray); text-transform:uppercase; margin-bottom:14px; }
.no-alerts { display:flex; flex-direction:column; align-items:center; gap:12px; padding:40px; color:var(--sb-accent); }
.no-alerts .app-icon { font-size:40px; width:40px; height:40px; }
.no-alerts p { font-size:13px; color:var(--sb-gray); }
.al-header-row,.al-row { display:grid; grid-template-columns:1fr 1fr 2fr 1.2fr 1.5fr 1fr; padding:8px 12px; border-bottom:1px solid var(--sb-border); gap:8px; align-items:center; }
.al-header-row { background:var(--sb-bg-card2); }
.al-header-row span { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:10px; letter-spacing:0.15em; color:var(--sb-gray); }
.nivel-badge { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:11px; }
.al-tipo { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:12px; color:var(--sb-white); }
.al-desc { font-size:11px; color:var(--sb-gray); }
.al-mono { font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--sb-gray); }
.al-estado { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:11px; color:var(--sb-red); }
.al-estado.resuelta { color:var(--sb-accent); }
</style>
