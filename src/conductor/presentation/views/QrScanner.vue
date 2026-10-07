<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/shared/presentation/components/AppIcon.vue'
import { useConductor } from '@/conductor/presentation/state/useConductor'
import type { Conductor } from '@/conductor/domain/model/Conductor'

const router = useRouter()
const state = useConductor()

const manualCode = ref('')
const conductorFound = ref<Conductor | null>(null)
const scanLine = ref(0)
const errorMsg = ref('')

/** Códigos de empleado reales que sí existen en el backend (creados por el seeder). */
const codigosRegistrados = ['EMP-001', 'EMP-002', 'EMP-003', 'EMP-004', 'EMP-005', 'EMP-006', 'EMP-007']

// animación de la línea de escaneo + auto-detección simulada a los 3s
const interval = setInterval(() => {
  scanLine.value = (scanLine.value + 3) % 100
}, 30)
const autoScan = setTimeout(() => simulateScan(), 3000)

async function simulateScan() {
  if (conductorFound.value) return // si ya validó manualmente, no pises el resultado
  const codigoAleatorio = codigosRegistrados[Math.floor(Math.random() * codigosRegistrados.length)]!
  try {
    const c = await state.iniciarSesion(codigoAleatorio)
    if (c) conductorFound.value = c
  } catch {
    errorMsg.value = 'No se pudo validar el escaneo automático.'
  }
}

async function validate() {
  const code = manualCode.value
  if (!code.trim()) return
  errorMsg.value = ''
  try {
    const c = await state.iniciarSesion(code)
    if (c) conductorFound.value = c
    else errorMsg.value = 'Código inválido.'
  } catch {
    errorMsg.value = 'Código inválido.'
  }
}

function startShift() {
  router.push('/conductor/access-authorized')
}

onBeforeUnmount(() => {
  clearInterval(interval)
  clearTimeout(autoScan)
})
</script>

<template>
  <div class="scanner-root">
    <div class="scanner-header">
      <div class="shield-icon">
        <AppIcon>shield</AppIcon>
      </div>
      <h2 class="brand">SECURITYBUS</h2>
      <p class="brand-sub">Validación de Identidad</p>
    </div>

    <!-- Scanner Card -->
    <div class="scanner-card">
      <div class="scan-label-row">
        <span class="scan-label">CÓDIGO DE VERIFICACIÓN</span>
        <span class="live-dot"><span class="dot-pulse"></span> LIVE SCAN</span>
      </div>

      <!-- Camera viewport -->
      <div class="camera-view">
        <div class="corner tl"></div>
        <div class="corner tr"></div>
        <div class="corner bl"></div>
        <div class="corner br"></div>
        <div class="qr-ghost">
          <AppIcon>qr_code_2</AppIcon>
        </div>
        <!-- scan line -->
        <div class="scan-line" :style="{ top: scanLine + '%' }"></div>
      </div>

      <!-- Manual input -->
      <label class="sb-field full-w">
        <input v-model="manualCode" placeholder="Ingresar código manualmente" @keyup.enter="validate" />
      </label>

      <button class="sb-btn-primary" @click="validate">VALIDAR IDENTIDAD</button>
      <p class="scan-note">Solo conductores registrados pueden iniciar servicio</p>
      <p v-if="errorMsg" class="scan-note" style="color: var(--sb-red)">{{ errorMsg }}</p>
    </div>

    <!-- Verified identity card -->
    <div v-if="conductorFound" class="identity-card">
      <div class="id-top">
        <img :src="conductorFound.foto" :alt="conductorFound.nombreCompleto" class="id-photo" />
        <div class="id-info">
          <span class="verified-badge">IDENTIDAD VERIFICADA</span>
          <h3 class="id-name">{{ conductorFound.nombreCompleto }}</h3>
          <p class="id-sub">ID: {{ conductorFound.codigoQr }}</p>
        </div>
      </div>
      <div class="id-details">
        <div class="id-detail-item">
          <span class="sb-label">PLACA VEHÍCULO</span>
          <span class="id-detail-val">{{ conductorFound.placa }}</span>
        </div>
        <div class="id-detail-item">
          <span class="sb-label">ESTADO</span>
          <span class="id-detail-val accent">{{ conductorFound.estado }}</span>
        </div>
      </div>
      <button class="sb-btn-primary" @click="startShift">INICIAR TURNO →</button>
    </div>

    <footer class="scanner-footer">
      <span class="sb-mono footer-left">TRANSIT-SEC PROTOCOL</span>
      <div class="footer-right">
        <span class="dot-green"></span> ENCRIPTACIÓN AES-256
        <span class="dot-green" style="margin-left: 12px"></span> CLOUD_SYNC OK
      </div>
    </footer>
  </div>
</template>

<style scoped>
.scanner-root {
  min-height: 100vh;
  background: var(--sb-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 16px 24px;
  gap: 20px;
}

.scanner-header { text-align: center; }
.shield-icon .app-icon {
  font-size: 48px; width: 48px; height: 48px;
  color: var(--sb-accent);
  background: rgba(181,240,0,0.1);
  padding: 12px;
  border-radius: 4px;
}
.brand {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 24px;
  letter-spacing: 0.2em;
  color: var(--sb-white);
  margin: 12px 0 4px;
}
.brand-sub { font-size: 12px; color: var(--sb-gray); letter-spacing: 0.1em; }

/* Scanner card */
.scanner-card {
  background: var(--sb-bg-card);
  border: 1px solid var(--sb-border2);
  padding: 20px;
  width: 100%;
  max-width: 400px;
}

.scan-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.scan-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--sb-gray);
}
.live-dot {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--sb-accent);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  letter-spacing: 0.1em;
}
.dot-pulse {
  width: 7px; height: 7px;
  background: var(--sb-accent);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

/* Camera viewport */
.camera-view {
  position: relative;
  width: 100%;
  padding-top: 66%;
  background: #050505;
  border: 1px solid var(--sb-border2);
  margin-bottom: 16px;
  overflow: hidden;
}
.corner {
  position: absolute;
  width: 24px; height: 24px;
  border-color: var(--sb-accent);
  border-style: solid;
  z-index: 2;
}
.corner.tl { top: 8px; left: 8px; border-width: 2px 0 0 2px; }
.corner.tr { top: 8px; right: 8px; border-width: 2px 2px 0 0; }
.corner.bl { bottom: 8px; left: 8px; border-width: 0 0 2px 2px; }
.corner.br { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; }

.qr-ghost {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.1;
}
.qr-ghost .app-icon { font-size: 64px; width: 64px; height: 64px; color: var(--sb-accent); }

.scan-line {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: var(--sb-accent);
  box-shadow: 0 0 8px var(--sb-accent), 0 0 16px var(--sb-accent);
  z-index: 3;
  transition: top 0.03s linear;
}

.full-w { width: 100%; margin-bottom: 12px; }
.scan-note { font-size: 11px; color: var(--sb-gray); text-align: center; margin-top: 10px; }

/* Identity card */
.identity-card {
  background: var(--sb-bg-card);
  border: 1px solid var(--sb-border2);
  padding: 20px;
  width: 100%;
  max-width: 400px;
}
.id-top { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 16px; }
.id-photo {
  width: 64px; height: 64px;
  border: 2px solid var(--sb-accent);
  border-radius: 2px;
  object-fit: cover;
  flex-shrink: 0;
}
.verified-badge {
  display: inline-block;
  background: var(--sb-accent);
  color: #000;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 10px;
  letter-spacing: 0.15em;
  padding: 2px 8px;
  margin-bottom: 6px;
}
.id-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 18px;
  color: var(--sb-white);
}
.id-sub { font-size: 11px; color: var(--sb-gray); }

.id-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: var(--sb-bg-card2);
  border: 1px solid var(--sb-border);
  padding: 14px 16px;
  margin-bottom: 16px;
}
.id-detail-item { display: flex; flex-direction: column; gap: 4px; }
.id-detail-val {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 15px;
  color: var(--sb-accent);
}

/* footer */
.scanner-footer {
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--sb-border);
  font-size: 10px;
  color: var(--sb-gray2);
}
.footer-left { font-size: 10px; }
.footer-right {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--sb-gray2);
}
.dot-green {
  width: 6px; height: 6px;
  background: var(--sb-accent);
  border-radius: 50%;
  display: inline-block;
}
</style>
