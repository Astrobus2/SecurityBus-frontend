<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AppIcon from '@/shared/presentation/components/AppIcon.vue'
import { useConductor } from '@/conductor/presentation/state/useConductor'
import { useFlota } from '@/tracking/presentation/state/useFlota'
import { formatNumber } from '@/shared/presentation/format'

const router = useRouter()
const state = useConductor()
const flota = useFlota()

const mapEl = ref<HTMLDivElement | null>(null)
const codigoDebug = ref('(sin código)')

let map: L.Map | null = null
let marker: L.Marker | null = null
let codigoEmpleado = ''

function miUnidad() {
  return flota.getUnidadByCodigo(codigoEmpleado) ?? flota.unidades[0]
}

// Mueve el marcador cada vez que cambia la posición de mi unidad.
watch(
  () => {
    const u = miUnidad()
    return u ? [u.lat, u.lng] : null
  },
  (pos) => {
    if (pos && marker) marker.setLatLng([pos[0]!, pos[1]!])
  },
)

onMounted(() => {
  codigoEmpleado = state.conductorActual?.codigoEmpleado ?? ''
  codigoDebug.value = codigoEmpleado || '⚠️ VACÍO — inicia sesión con tu código'

  const unidad = miUnidad()
  const lat = unidad?.lat ?? -12.0464
  const lng = unidad?.lng ?? -77.0428

  map = L.map(mapEl.value!, { zoomControl: true }).setView([lat, lng], 14)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  const icon = L.divIcon({ className: 'bus-marker-conductor', html: '<div class="bus-dot"></div>', iconSize: [18, 18] })
  marker = L.marker([lat, lng], { icon }).addTo(map)
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})

function goBack() { router.push('/conductor/dashboard') }
</script>

<template>
  <div class="map-root">
    <div class="map-area">
      <div ref="mapEl" class="leaflet-host"></div>
    </div>
    <div class="map-stats">
      <div class="stat-block">
        <span class="sb-label">TIEMPO TOTAL</span>
        <span class="stat-val mono">{{ state.tiempoStr }}</span>
      </div>
      <div class="stat-block">
        <span class="sb-label">DISTANCIA</span>
        <span class="stat-val accent">{{ formatNumber(state.distanciaKm, 1, 1) }} KM</span>
      </div>
      <div class="stat-block">
        <span class="sb-label">MI CÓDIGO</span>
        <span class="stat-val mono" style="font-size: 16px">{{ codigoDebug }}</span>
      </div>
      <button class="sb-btn-outline back-btn" @click="goBack">
        <AppIcon>arrow_back</AppIcon> VOLVER
      </button>
    </div>
  </div>
</template>

<style scoped>
.map-root {
  display: grid;
  grid-template-columns: 1fr 200px;
  height: calc(100vh - 48px);
}
.map-area { overflow: hidden; border-right: 1px solid var(--sb-border); position: relative; }
.leaflet-host { width: 100%; height: 100%; }
.map-stats {
  background: var(--sb-bg);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.stat-block { display: flex; flex-direction: column; gap: 8px; }
.stat-val {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 32px;
  color: var(--sb-white);
  line-height: 1;
}
.stat-val.mono { font-family: 'Share Tech Mono', monospace; color: var(--sb-accent); }
.stat-val.accent { color: var(--sb-accent); }
.back-btn { width: auto; margin-top: auto; }
</style>
