<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '@/shared/presentation/components/AppIcon.vue'
import { administrationUseCases } from '@/administration/infrastructure/container'

const selected = ref<number | null>(null)
const searchTerm = ref('')

const conductores = administrationUseCases.listarConductores.execute()
const filtered = computed(() => administrationUseCases.listarConductores.execute(searchTerm.value))

function estadoColor(e: string) {
  return e === 'ACTIVO' ? 'var(--sb-accent)' : 'var(--sb-gray)'
}
</script>

<template>
  <div class="dm-root">
    <div class="dm-header">
      <div>
        <h2 class="dm-title">GESTIÓN DE CONDUCTORES</h2>
        <p class="dm-sub">{{ conductores.length }} conductores registrados</p>
      </div>
      <div class="dm-search">
        <AppIcon>search</AppIcon>
        <input v-model="searchTerm" placeholder="Buscar conductor..." />
      </div>
    </div>

    <div class="driver-table">
      <div class="table-header">
        <span>CONDUCTOR</span>
        <span>DNI</span>
        <span>CÓD. EMPLEADO</span>
        <span>PLACA</span>
        <span>ESTADO</span>
        <span>ACCIONES</span>
      </div>
      <div
        v-for="c in filtered"
        :key="c.id"
        class="table-row"
        :class="{ 'row-selected': selected === c.id }"
        @click="selected = c.id"
      >
        <div class="driver-cell">
          <img :src="c.foto" :alt="c.nombre" class="driver-photo" />
          <div>
            <p class="driver-name">{{ c.nombre }} {{ c.apellido }}</p>
            <p class="driver-qr">{{ c.codigoQr }}</p>
          </div>
        </div>
        <span class="cell-mono">{{ c.dni }}</span>
        <span class="cell-mono">{{ c.codigoEmpleado }}</span>
        <span class="cell-accent">{{ c.placa }}</span>
        <span class="cell-estado" :style="{ color: estadoColor(c.estado) }">{{ c.estado }}</span>
        <div class="cell-actions">
          <button class="action-btn"><AppIcon>edit</AppIcon></button>
          <button class="action-btn red"><AppIcon>block</AppIcon></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dm-root { padding: 20px; }
.dm-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.dm-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 22px; color: var(--sb-white); }
.dm-sub { font-size: 12px; color: var(--sb-gray); margin-top: 4px; }
.dm-search { display: flex; align-items: center; gap: 8px; background: var(--sb-bg-card); border: 1px solid var(--sb-border2); padding: 8px 14px; }
.dm-search .app-icon { font-size: 18px; width: 18px; height: 18px; color: var(--sb-gray); }
.dm-search input { background: none; border: none; outline: none; color: var(--sb-white); font-size: 13px; width: 200px; }
.dm-search input::placeholder { color: var(--sb-gray2); }
.driver-table { background: var(--sb-bg-card); border: 1px solid var(--sb-border); }
.table-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; padding: 10px 16px; background: var(--sb-bg-card2); border-bottom: 1px solid var(--sb-border); }
.table-header span { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.15em; color: var(--sb-gray); }
.table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; padding: 12px 16px; border-bottom: 1px solid var(--sb-border); align-items: center; cursor: pointer; transition: background 0.15s; }
.table-row:hover { background: var(--sb-bg-card2); }
.row-selected { background: rgba(181,240,0,0.05) !important; border-left: 2px solid var(--sb-accent); }
.driver-cell { display: flex; align-items: center; gap: 10px; }
.driver-photo { width: 36px; height: 36px; border-radius: 2px; border: 1px solid var(--sb-border2); object-fit: cover; }
.driver-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 13px; color: var(--sb-white); }
.driver-qr { font-family: 'Share Tech Mono', monospace; font-size: 9px; color: var(--sb-gray2); }
.cell-mono { font-family: 'Share Tech Mono', monospace; font-size: 11px; color: var(--sb-gray); }
.cell-accent { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 13px; color: var(--sb-accent); }
.cell-estado { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 12px; }
.cell-actions { display: flex; gap: 4px; }
.action-btn { background: var(--sb-bg-card2); border: 1px solid var(--sb-border); padding: 4px 6px; cursor: pointer; color: var(--sb-gray); transition: color 0.15s; display: flex; align-items: center; }
.action-btn .app-icon { font-size: 16px; width: 16px; height: 16px; }
.action-btn:hover { color: var(--sb-white); }
.action-btn.red:hover { color: var(--sb-red); border-color: var(--sb-red); }
</style>
