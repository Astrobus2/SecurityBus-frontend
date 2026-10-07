<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AppIcon from '@/shared/presentation/components/AppIcon.vue'
import { useFlota } from '@/tracking/presentation/state/useFlota'

const fleet = useFlota()

const unidades = computed(() => fleet.unidades)
const alertas = computed(() => fleet.alertas)

const activasCnt = computed(() => unidades.value.filter((u) => u.estado === 'ACTIVO' || u.estado === 'ALERTA').length)
const alertaCnt = computed(() => alertas.value.filter((a) => !a.resuelta).length)
const pasajerosCnt = computed(() => unidades.value.reduce((s, u) => s + u.pasajeros, 0))

function nivelColor(n: string) {
  return n === 'CRITICO' ? '#e8002a' : n === 'ALTO' ? '#ff6d00' : n === 'MEDIO' ? '#f0a000' : '#888'
}
function estadoColor(e: string) {
  return e === 'ACTIVO' ? 'var(--sb-accent)' : e === 'ALERTA' ? '#e8002a' : 'var(--sb-gray)'
}

function resolverAlerta(id: number) {
  fleet.resolverAlerta(id)
}

const mapEl = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
const markers = new Map<number, L.Marker>()
let renderInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  map = L.map(mapEl.value!).setView([-12.06, -77.04], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  renderMarcadores()
  renderInterval = setInterval(renderMarcadores, 2000)
})

function renderMarcadores() {
  if (!map) return
  for (const u of unidades.value) {
    const color = u.estado === 'ALERTA' ? '#e8002a' : u.estado === 'ACTIVO' ? '#c8ff00' : '#888'
    let marker = markers.get(u.id)
    if (!marker) {
      const icon = L.divIcon({
        className: 'bus-marker-admin',
        html: `<div class="bus-dot" style="background:${color}"></div>`,
        iconSize: [16, 16],
      })
      marker = L.marker([u.lat, u.lng], { icon }).addTo(map).bindTooltip(`${u.placa} — ${u.conductor}`)
      markers.set(u.id, marker)
    } else {
      marker.setLatLng([u.lat, u.lng])
      const el = marker.getElement()?.querySelector<HTMLElement>('.bus-dot')
      if (el) el.style.background = color
    }
  }
}

function focarUnidad(placa: string) {
  const unidad = unidades.value.find((u) => u.placa === placa)
  if (unidad && map) {
    map.setView([unidad.lat, unidad.lng], 16, { animate: true })
    markers.get(unidad.id)?.openTooltip()
  }
}

onBeforeUnmount(() => {
  if (renderInterval) clearInterval(renderInterval)
  map?.remove()
  map = null
  markers.clear()
})
</script>

<template>
  <div class="cc-root">
    <div class="kpi-row">
      <div class="kpi-card">
        <AppIcon>directions_bus</AppIcon>
        <div class="kpi-data">
          <span class="kpi-val">{{ activasCnt }}</span>
          <span class="sb-label">UNIDADES ACTIVAS</span>
        </div>
      </div>
      <div class="kpi-card red">
        <AppIcon>warning</AppIcon>
        <div class="kpi-data">
          <span class="kpi-val red">{{ alertaCnt }}</span>
          <span class="sb-label">ALERTAS ACTIVAS</span>
        </div>
      </div>
      <div class="kpi-card">
        <AppIcon>people</AppIcon>
        <div class="kpi-data">
          <span class="kpi-val">{{ pasajerosCnt }}</span>
          <span class="sb-label">PASAJEROS ABORDO</span>
        </div>
      </div>
    </div>

    <div class="cc-grid">
      <div class="cc-map sb-card">
        <p class="section-label">MAPA OPERACIONAL EN TIEMPO REAL</p>
        <div class="map-wrap">
          <div ref="mapEl" class="leaflet-host"></div>
        </div>
      </div>

      <div class="cc-right">
        <div class="sb-card unit-list">
          <p class="section-label">ESTADO DE UNIDADES</p>
          <div class="unit-rows">
            <div v-for="u in unidades" :key="u.id" class="unit-row" @click="focarUnidad(u.placa)">
              <div class="unit-left">
                <AppIcon :style="{ color: estadoColor(u.estado) }">directions_bus</AppIcon>
                <div>
                  <p class="unit-placa">{{ u.placa }}</p>
                  <p class="unit-cond">{{ u.conductor }}</p>
                </div>
              </div>
              <div class="unit-right">
                <span class="unit-ruta">{{ u.ruta }}</span>
                <span class="unit-estado" :style="{ color: estadoColor(u.estado) }">{{ u.estado }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sb-card alert-list">
          <p class="section-label">ALERTAS RECIENTES</p>
          <div v-for="a in alertas" :key="a.id" class="alert-row" :class="{ resolved: a.resuelta }" @click="focarUnidad(a.bus)">
            <div class="alert-left">
              <span class="alert-nivel" :style="{ color: nivelColor(a.nivel) }">{{ a.nivel }}</span>
              <div>
                <p class="alert-tipo">{{ a.tipo }} — {{ a.bus }}</p>
                <p class="alert-hora">{{ a.conductor }} · {{ a.hora }}</p>
              </div>
            </div>
            <button v-if="!a.resuelta" class="resolve-btn" @click.stop="resolverAlerta(a.id)">RESOLVER</button>
            <span v-else class="resolved-badge">RESUELTO</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cc-root { padding: 16px; display: flex; flex-direction: column; gap: 16px; height: calc(100vh - 48px); overflow-y: auto; }
.kpi-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
.kpi-card { background: var(--sb-bg-card); border: 1px solid var(--sb-border); padding: 16px 20px; display: flex; align-items: center; gap: 16px; }
.kpi-card .app-icon { font-size: 32px; width: 32px; height: 32px; color: var(--sb-accent); }
.kpi-card.red .app-icon { color: var(--sb-red); }
.kpi-data { display: flex; flex-direction: column; gap: 4px; }
.kpi-val { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 36px; color: var(--sb-accent); line-height: 1; }
.kpi-val.red { color: var(--sb-red); }

.cc-grid { display: grid; grid-template-columns: 1fr 320px; gap: 16px; flex: 1; min-height: 0; }
.cc-map { display: flex; flex-direction: column; }
.map-wrap { flex: 1; position: relative; min-height: 300px; overflow: hidden; border: 1px solid var(--sb-border); }
.leaflet-host { width: 100%; height: 100%; }
.unit-row, .alert-row { cursor: pointer; }

.cc-right { display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
.unit-rows { display: flex; flex-direction: column; gap: 6px; max-height: 220px; overflow-y: auto; }
.unit-row { display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--sb-bg-card2); border: 1px solid var(--sb-border); }
.unit-left { display: flex; align-items: center; gap: 10px; }
.unit-left .app-icon { font-size: 20px; width: 20px; height: 20px; }
.unit-placa { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 13px; color: var(--sb-white); }
.unit-cond { font-size: 10px; color: var(--sb-gray); }
.unit-right { text-align: right; }
.unit-ruta { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--sb-gray); display: block; }
.unit-estado { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 11px; }

.alert-list { flex: 1; overflow-y: auto; }
.alert-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 8px; border-bottom: 1px solid var(--sb-border); gap: 8px; }
.alert-row.resolved { opacity: 0.4; }
.alert-left { display: flex; align-items: flex-start; gap: 10px; }
.alert-nivel { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 10px; letter-spacing: 0.1em; flex-shrink: 0; }
.alert-tipo { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 12px; color: var(--sb-white); }
.alert-hora { font-size: 10px; color: var(--sb-gray); }
.resolve-btn { background: var(--sb-red); color: #fff; border: none; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.1em; padding: 5px 10px; cursor: pointer; white-space: nowrap; flex-shrink: 0; }
.resolved-badge { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 10px; color: var(--sb-accent); flex-shrink: 0; }
.section-label { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.2em; color: var(--sb-gray); text-transform: uppercase; margin-bottom: 12px; }
</style>
