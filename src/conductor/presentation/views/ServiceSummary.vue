<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppIcon from '@/shared/presentation/components/AppIcon.vue'
import { useConductor } from '@/conductor/presentation/state/useConductor'
import { formatNumber, formatTime } from '@/shared/presentation/format'

const router = useRouter()
const state = useConductor()
// Turno recién cerrado o, tras recargar la página, el último guardado en localStorage.
const turno = state.turnoParaResumen()

function newService() {
  state.cerrarSesion()
  router.push('/conductor/login')
}
</script>

<template>
  <div class="dash-root">
    <div class="dash-main">
      <div class="sb-card service-card">
        <p class="section-label">RESUMEN DE TURNO FINALIZADO</p>
        <div v-if="turno" class="metrics-row">
          <div class="metric">
            <span class="sb-label">DISTANCIA</span>
            <span class="sb-value">{{ formatNumber(turno.distanciaKm, 1, 1) }} KM</span>
          </div>
          <div class="metric">
            <span class="sb-label">TIEMPO TOTAL</span>
            <span class="sb-value mono">{{ formatTime(turno.tiempoSegundos) }}</span>
          </div>
          <div class="metric">
            <span class="sb-label">PASAJEROS</span>
            <span class="sb-value">{{ turno.pasajeros }}</span>
          </div>
          <div class="metric">
            <span class="sb-label">RECAUDACIÓN</span>
            <span class="sb-value">${{ formatNumber(turno.recaudacion, 2, 2) }}</span>
          </div>
        </div>
      </div>

      <div class="sb-card route-card">
        <p class="section-label">RUTA OPERADA</p>
        <div class="route-row">
          <span class="route-badge">R-42</span>
          <div class="route-info">
            <p class="route-name">Terminal Norte → Estación Central</p>
            <p class="route-sub">Última parada: Calle 45 con Av. Principal</p>
          </div>
          <button class="sb-btn-primary new-service-btn" @click="newService">INICIAR NUEVO SERVICIO</button>
        </div>
      </div>

      <div class="sb-card protocol-card">
        <p class="section-label">PROTOCOLO DE CIERRE</p>
        <div class="check-list">
          <label class="check-row"><input type="checkbox" /><span>Vehículo estacionado en zona segura / terminal</span></label>
          <label class="check-row"><input type="checkbox" /><span>Verificación de interior sin objetos perdidos</span></label>
          <label class="check-row"><input type="checkbox" /><span>Validación de total de pasajeros en consola</span></label>
        </div>
      </div>
    </div>

    <div class="dash-right">
      <div class="sb-card finish-card">
        <div class="power-icon"><AppIcon>power_settings_new</AppIcon></div>
        <p class="finish-label">CONFIRMACIÓN FINAL</p>
        <button class="finish-btn" disabled>FINALIZAR SERVICIO</button>
        <p class="finish-warning">ESTA ACCIÓN NO PUEDE DESHACERSE</p>
      </div>
      <div class="sb-card status-card">
        <p class="section-label">ESTADO DEL SISTEMA</p>
        <div class="status-rows">
          <div class="status-row"><span class="st-key">GPS</span><span class="st-val">ESTABLE</span></div>
          <div class="status-row"><span class="st-key">TELEMETRÍA</span><span class="st-val">SINCRO</span></div>
          <div class="status-row"><span class="st-key">RED CLOUD</span><span class="st-val">ACTIVA</span></div>
        </div>
      </div>
      <div class="map-preview">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=-77.0700,-12.1200,-76.9400,-12.0200&layer=mapnik&marker=-12.0464,-77.0428"
          width="100%"
          height="100%"
          style="border: none; filter: brightness(0.7) saturate(0.6)"
          title="Mapa Lima"
        ></iframe>
        <div class="map-overlay-bar"><span class="dot-g-sm"></span> VIGILANCIA ACTIVA: TRANSMITIENDO A CENTRAL</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-root {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 16px;
  padding: 16px;
  height: calc(100vh - 48px);
  overflow-y: auto;
}

/* MAIN */
.dash-main { display: flex; flex-direction: column; gap: 12px; }

.section-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--sb-gray);
  text-transform: uppercase;
  margin-bottom: 16px;
}

/* Metrics */
.service-card { position: relative; }
.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.metric { display: flex; flex-direction: column; gap: 6px; }
.sb-value.mono { font-family: 'Share Tech Mono', monospace; font-size: 24px; }

/* Route */
.route-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.route-badge {
  background: var(--sb-accent);
  color: #000;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 14px;
  padding: 6px 12px;
  flex-shrink: 0;
}
.route-info { flex: 1; }
.route-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: var(--sb-white);
}
.route-sub { font-size: 11px; color: var(--sb-gray); margin-top: 2px; }

.map-btn { width: auto; padding: 8px 20px; }

/* Protocol */
.check-list { display: flex; flex-direction: column; gap: 12px; }
.check-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--sb-bg-card2);
  border: 1px solid var(--sb-border);
  cursor: pointer;
  font-size: 13px;
  color: var(--sb-gray);
}
.check-row input[type="checkbox"] {
  accent-color: var(--sb-accent);
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* RIGHT */
.dash-right { display: flex; flex-direction: column; gap: 12px; }

.finish-card { text-align: center; }
.power-icon .app-icon {
  font-size: 40px; width: 40px; height: 40px;
  color: var(--sb-gray2);
}
.finish-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--sb-gray);
  margin: 10px 0 12px;
}
.finish-btn {
  background: var(--sb-accent);
  color: #000;
  border: none;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 13px;
  letter-spacing: 0.1em;
  padding: 14px 12px;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
}
.finish-btn:hover { background: #ceff00; }
.finish-warning { font-size: 9px; color: var(--sb-gray2); margin-top: 6px; letter-spacing: 0.08em; }

/* Status */
.status-rows { display: flex; flex-direction: column; gap: 6px; }
.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid var(--sb-border);
}
.status-row:last-child { border-bottom: none; }
.st-key { font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 11px; color: var(--sb-gray); }
.st-val { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 11px; color: var(--sb-accent); }

/* Map preview */
.map-preview {
  flex: 1;
  min-height: 200px;
  border: 1px solid var(--sb-border);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.map-overlay-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: rgba(0,0,0,0.85);
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--sb-white);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 600;
  letter-spacing: 0.1em;
}
.dot-g-sm {
  width: 7px; height: 7px;
  background: var(--sb-accent);
  border-radius: 50%;
  animation: pulse 2s infinite;
  flex-shrink: 0;
}
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

/* Modal */
.finish-modal { max-width: 340px; width: 100%; }
.modal-check {
  width: 56px; height: 56px;
  background: rgba(181,240,0,0.12);
  border: 2px solid var(--sb-accent);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.modal-check .app-icon { font-size: 28px; width: 28px; height: 28px; color: var(--sb-accent); }
.modal-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 20px;
  color: var(--sb-white);
  margin-bottom: 10px;
}
.modal-sub { font-size: 13px; color: var(--sb-gray); line-height: 1.5; margin-bottom: 8px; }
.modal-id { font-size: 10px; color: var(--sb-gray2); margin-bottom: 20px; }
.modal-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.new-service-btn { width: auto; padding: 8px 20px; }
.finish-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
