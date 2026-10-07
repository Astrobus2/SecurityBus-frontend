<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/shared/presentation/components/AppIcon.vue'
import { useConductor } from '@/conductor/presentation/state/useConductor'

const router = useRouter()
const state = useConductor()

const codigoEmpleado = ref('')
const errors = ref<string[]>([])
const loading = ref(false)

const errorList = [
  { icon: 'error', color: '#e8002a', title: 'Código inválido', desc: 'La firma digital no coincide con los registros actuales.' },
  { icon: 'info', color: '#888', title: 'Conductor no autorizado', desc: 'Su perfil no tiene permisos para esta zona operativa.' },
  { icon: 'warning', color: '#f0a000', title: 'Conflicto de vehículo', desc: 'El vehículo #SB-902 ya tiene un conductor asignado.' },
]

function openScanner() {
  router.push('/conductor/qr-scanner')
}

async function verify() {
  const code = codigoEmpleado.value
  if (!code.trim()) {
    errors.value = ['empty']
    return
  }
  loading.value = true
  errors.value = []
  try {
    const conductor = await state.iniciarSesion(code)
    loading.value = false
    if (conductor) router.push('/conductor/access-authorized')
    else errors.value = ['invalid']
  } catch {
    loading.value = false
    errors.value = ['invalid']
  }
}
</script>

<template>
  <div class="login-root">
    <!-- LEFT PANEL -->
    <div class="left-panel">
      <div class="bus-overlay">
        <span class="estado-badge">ESTADO: EN ESPERA</span>
        <h1 class="hero-title">Vigilancia Operativa<br />en Tiempo Real.</h1>
        <p class="hero-sub">Acceda al panel de control industrial de SecurityBus para gestionar rutas, telemetría y protocolos de seguridad crítica.</p>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="right-panel">
      <div class="form-wrap">
        <div class="brand-top">
          <span class="brand-name">SecurityBus</span>
          <h2 class="form-title">Verificación de Identidad</h2>
          <p class="form-sub">Escanee su credencial digital para iniciar el turno.</p>
        </div>

        <!-- QR Scanner trigger -->
        <div class="qr-box" @click="openScanner">
          <div class="qr-icon">
            <AppIcon>qr_code_scanner</AppIcon>
          </div>
          <p class="qr-label">CÓDIGO QR REQUERIDO</p>
          <p class="qr-sub">Coloque el código frente a la cámara.</p>
        </div>

        <!-- Code input -->
        <div class="field-wrap">
          <label class="sb-field full-w">
            <AppIcon>badge</AppIcon>
            <input v-model="codigoEmpleado" placeholder="Código de Empleado" />
          </label>
        </div>

        <button class="sb-btn-primary" :disabled="loading" @click="verify">
          <template v-if="loading"><AppIcon>hourglass_top</AppIcon> VERIFICANDO...</template>
          <template v-else>VERIFICAR CREDENCIALES <AppIcon>verified</AppIcon></template>
        </button>

        <!-- Errors -->
        <div class="errors-list">
          <div
            v-for="e in errorList"
            :key="e.title"
            class="error-item"
            :class="{ active: errors.length > 0 }"
          >
            <AppIcon :style="{ color: e.color }">{{ e.icon }}</AppIcon>
            <div>
              <p class="err-title">{{ e.title }}</p>
              <p class="err-desc">{{ e.desc }}</p>
            </div>
          </div>
        </div>

        <div class="form-footer">
          <span class="footer-item"><AppIcon>language</AppIcon> ESP-LATAM</span>
          <span class="footer-item"><AppIcon>support_agent</AppIcon> Soporte Técnico</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-root {
  display: flex;
  height: 100vh;
  background: var(--sb-bg);
}

/* LEFT */
.left-panel {
  flex: 1;
  background: url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=900&q=80') center/cover no-repeat;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 40px;
}
.bus-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
  position: absolute;
  inset: 0;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.estado-badge {
  display: inline-block;
  background: var(--sb-accent);
  color: #000;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 0.2em;
  padding: 4px 12px;
  margin-bottom: 16px;
  width: fit-content;
}
.hero-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 36px;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 12px;
}
.hero-sub {
  font-size: 13px;
  color: rgba(255,255,255,0.65);
  line-height: 1.6;
  max-width: 340px;
}

/* RIGHT */
.right-panel {
  width: 420px;
  background: var(--sb-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  border-left: 1px solid var(--sb-border);
  overflow-y: auto;
}
.form-wrap { width: 100%; max-width: 360px; }

.brand-top { margin-bottom: 24px; }
.brand-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 18px;
  color: var(--sb-accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.form-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: var(--sb-white);
  margin: 4px 0;
}
.form-sub { font-size: 12px; color: var(--sb-gray); }

/* QR box */
.qr-box {
  background: var(--sb-bg-card);
  border: 1px solid var(--sb-border2);
  padding: 28px 16px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 16px;
  transition: border-color 0.2s;
}
.qr-box:hover { border-color: var(--sb-accent); }
.qr-icon .app-icon {
  font-size: 40px;
  width: 40px;
  height: 40px;
  color: var(--sb-accent);
}
.qr-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--sb-accent);
  margin: 8px 0 4px;
}
.qr-sub { font-size: 11px; color: var(--sb-gray); }

.field-wrap { margin-bottom: 12px; }
.full-w { width: 100%; }

/* Errors */
.errors-list { margin-top: 16px; display: flex; flex-direction: column; gap: 6px; }
.error-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: var(--sb-bg-card);
  border: 1px solid var(--sb-border);
  padding: 10px 12px;
  opacity: 0.4;
  transition: opacity 0.2s;
}
.error-item.active { opacity: 1; }
.error-item .app-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
.err-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 12px; color: var(--sb-white); }
.err-desc  { font-size: 11px; color: var(--sb-gray); line-height: 1.4; margin-top: 2px; }

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--sb-border);
}
.footer-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--sb-gray);
}
.footer-item .app-icon { font-size: 14px; width: 14px; height: 14px; }

@media (max-width: 768px) {
  .left-panel { display: none; }
  .right-panel { width: 100%; }
}
</style>
