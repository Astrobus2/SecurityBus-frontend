<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/shared/presentation/components/AppIcon.vue'
import { useConductor } from '@/conductor/presentation/state/useConductor'
import { useFlota } from '@/tracking/presentation/state/useFlota'

const router = useRouter()
const state = useConductor()
const flota = useFlota()

const coords = ref('4.7110° N, 74.0721° W')
const cancelCountdown = ref(5)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  const codigo = state.conductorActual?.codigoEmpleado
  if (codigo) {
    void flota.dispararPanico(codigo) // la alerta local se crea al instante; el backend responde después
    const unidad = flota.getUnidadByCodigo(codigo)
    if (unidad) {
      coords.value = `${unidad.lat.toFixed(4)}° S, ${Math.abs(unidad.lng).toFixed(4)}° W`
    }
  }
  timer = setInterval(() => {
    cancelCountdown.value = cancelCountdown.value > 0 ? cancelCountdown.value - 1 : 0
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

function cancel() { router.push('/conductor/dashboard') }
function ok() { router.push('/conductor/dashboard') }
</script>

<template>
  <div class="panic-root">
    <div class="panic-modal">
      <div class="alert-icon">
        <AppIcon>check</AppIcon>
      </div>
      <h2 class="alert-title">¡ALERTA ENVIADA!</h2>
      <p class="alert-sub">TRANSMISIÓN DE EMERGENCIA ACTIVA</p>

      <div class="info-rows">
        <div class="info-row">
          <span class="info-key">COORDENADAS GPS</span>
          <span class="info-val">{{ coords }}</span>
        </div>
        <div class="info-row">
          <span class="info-key">ESTADO CENTRAL</span>
          <span class="info-val">CENTRAL NOTIFICADA <AppIcon class="tiny">check</AppIcon></span>
        </div>
        <div class="info-row">
          <span class="info-key">AUDIO REMOTO</span>
          <span class="info-val blink">GRABANDO...</span>
        </div>
      </div>

      <button class="cancel-btn" :disabled="cancelCountdown > 0" @click="cancel">
        CANCELAR ALERTA <template v-if="cancelCountdown > 0">({{ cancelCountdown }}s)</template>
      </button>
      <button class="ok-btn" @click="ok">Ok</button>
    </div>
  </div>
</template>

<style scoped>
.panic-root {
  min-height: 100vh;
  background: var(--sb-red);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.panic-modal {
  background: var(--sb-bg-card);
  border: 1px solid var(--sb-border2);
  padding: 40px 32px;
  width: 100%;
  max-width: 360px;
  text-align: center;
}
.alert-icon {
  width: 60px; height: 60px;
  background: var(--sb-red);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
}
.alert-icon .app-icon { font-size: 32px; width: 32px; height: 32px; color: #fff; }
.alert-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900; font-size: 28px; color: var(--sb-white); margin-bottom: 6px;
}
.alert-sub {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: 11px; letter-spacing: 0.2em; color: var(--sb-gray); margin-bottom: 24px;
}
.info-rows { background: var(--sb-bg-card2); border: 1px solid var(--sb-border); padding: 16px; margin-bottom: 20px; text-align: left; }
.info-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--sb-border); }
.info-row:last-child { border-bottom: none; }
.info-key { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.1em; color: var(--sb-gray); }
.info-val { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 12px; color: var(--sb-accent); display: flex; align-items: center; gap: 4px; }
.info-val.blink { animation: blink 1s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
.tiny { font-size: 14px !important; width: 14px !important; height: 14px !important; }
.cancel-btn {
  width: 100%; padding: 14px; margin-bottom: 10px;
  background: transparent; border: 1px solid var(--sb-border2);
  color: var(--sb-white); font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: 13px; letter-spacing: 0.1em; cursor: pointer;
  transition: border-color 0.2s;
}
.cancel-btn:not(:disabled):hover { border-color: var(--sb-red); color: var(--sb-red); }
.cancel-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.ok-btn {
  width: 100%; padding: 14px;
  background: #fff; border: none;
  color: #000; font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: 13px; letter-spacing: 0.1em; cursor: pointer;
}
.ok-btn:hover { background: #eee; }
</style>
