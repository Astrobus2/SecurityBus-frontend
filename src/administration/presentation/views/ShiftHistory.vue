<script setup lang="ts">
import { administrationUseCases } from '@/administration/infrastructure/container'
import { formatNumber } from '@/shared/presentation/format'

// Incluye los turnos cerrados en este navegador (localStorage) más los de muestra.
const historial = administrationUseCases.listarHistorialTurnos.execute()

function estadoColor(e: string) {
  return e === 'FINALIZADO' ? 'var(--sb-accent)' : e === 'ALERTA' ? 'var(--sb-red)' : 'var(--sb-gray)'
}
</script>

<template>
  <div class="sh-root">
    <h2 class="page-title">HISTORIAL DE TURNOS</h2>
    <div class="shift-table">
      <div class="sh-header">
        <span>CONDUCTOR</span><span>BUS</span><span>RUTA</span><span>FECHA</span>
        <span>KM</span><span>PASAJEROS</span><span>RECAUDACIÓN</span><span>ESTADO</span>
      </div>
      <div v-for="t in historial" :key="t.id" class="sh-row">
        <span class="sh-name">{{ t.conductor }}</span>
        <span class="sh-mono">{{ t.bus }}</span>
        <span class="sh-mono">{{ t.ruta }}</span>
        <span class="sh-mono">{{ t.fecha }}</span>
        <span class="sh-val">{{ formatNumber(t.distancia, 1, 1) }}</span>
        <span class="sh-val">{{ t.pasajeros }}</span>
        <span class="sh-accent">${{ formatNumber(t.recaudacion, 0, 0) }}</span>
        <span class="sh-estado" :style="{ color: estadoColor(t.estado) }">{{ t.estado }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sh-root { padding: 20px; }
.page-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:22px; color:var(--sb-white); margin-bottom:20px; }
.shift-table { background:var(--sb-bg-card); border:1px solid var(--sb-border); }
.sh-header,.sh-row { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; padding:10px 16px; border-bottom:1px solid var(--sb-border); align-items:center; gap:8px; }
.sh-header { background:var(--sb-bg-card2); }
.sh-header span { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:10px; letter-spacing:0.15em; color:var(--sb-gray); }
.sh-row:hover { background:var(--sb-bg-card2); }
.sh-name { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; color:var(--sb-white); }
.sh-mono { font-family:'Share Tech Mono',monospace; font-size:11px; color:var(--sb-gray); }
.sh-val { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; color:var(--sb-white); }
.sh-accent { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:13px; color:var(--sb-accent); }
.sh-estado { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:11px; }
</style>
