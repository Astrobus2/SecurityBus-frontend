<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/shared/presentation/components/AppIcon.vue'
import { useConductor } from '@/conductor/presentation/state/useConductor'

const router = useRouter()
const state = useConductor()

const coords = ref('4.7110° N, 74.0721° W')

onMounted(() => {
  if (!state.conductorActual) {
    router.push('/conductor/login')
    return
  }
  // Si ya hay un turno en curso (p. ej. tras recargar), no se reinicia.
  if (!state.turnoActivo) state.iniciarTurno('BUS-7729')
})

function next() {
  router.push('/conductor/dashboard')
}
</script>

<template>
  <div class="auth-root">
    <div class="sb-modal auth-modal">
      <div class="check-icon">
        <AppIcon>check</AppIcon>
      </div>
      <h2 class="auth-title">Acceso Autorizado</h2>
      <p class="auth-sub">TRANSMISIÓN DE EMERGENCIA ACTIVA</p>

      <div class="info-rows">
        <div class="info-row">
          <span class="info-key">COORDENADAS GPS</span>
          <span class="info-val accent">{{ coords }}</span>
        </div>
        <div class="info-row">
          <span class="info-key">ESTADO CENTRAL</span>
          <span class="info-val accent">CENTRAL NOTIFICADA <AppIcon class="tiny-icon">check</AppIcon></span>
        </div>
        <div class="info-row">
          <span class="info-key">AUDIO REMOTO</span>
          <span class="info-val accent-blink">GRABANDO...</span>
        </div>
      </div>

      <button class="sb-btn-outline continue-btn" @click="next">Seguir</button>
    </div>

    <footer class="aa-footer">
      <span class="sb-mono">TRANSIT-SEC PROTOCOL // DATA_STAMP:2028.04.OPERATIONAL</span>
      <div class="footer-dots">
        <span class="dot-g"></span> ENCRIPTACIÓN AES-256
        <span class="dot-g ml"></span> CLOUD_SYNC OK
      </div>
    </footer>
  </div>
</template>

<style scoped>
.auth-root {
  min-height: 100vh;
  background: #00e676;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 24px;
}

.auth-modal {
  background: var(--sb-bg-card);
  border: 1px solid var(--sb-border2);
  padding: 40px 32px;
  width: 100%;
  max-width: 360px;
  text-align: center;
}

.check-icon {
  width: 64px; height: 64px;
  background: var(--sb-accent);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
.check-icon .app-icon {
  font-size: 36px; width: 36px; height: 36px; color: #000;
}

.auth-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 30px;
  font-style: italic;
  color: var(--sb-white);
  margin-bottom: 6px;
}
.auth-sub {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--sb-gray);
  margin-bottom: 24px;
}

.info-rows {
  background: var(--sb-bg-card2);
  border: 1px solid var(--sb-border);
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--sb-border);
}
.info-row:last-child { border-bottom: none; }
.info-key {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--sb-gray);
}
.info-val {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.info-val.accent { color: var(--sb-accent); }
.tiny-icon { font-size: 14px !important; width: 14px !important; height: 14px !important; }
.accent-blink {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 12px;
  color: var(--sb-accent);
  animation: blink 1s infinite;
}
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

.continue-btn { background: #fff; color: #000; border-color: #fff; }

/* footer */
.aa-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 360px;
  font-size: 9px;
  color: rgba(0,0,0,0.5);
}
.footer-dots { display: flex; align-items: center; gap: 4px; }
.dot-g { width: 6px; height: 6px; background: #000; border-radius: 50%; opacity: 0.5; }
.dot-g.ml { margin-left: 8px; }
</style>
