import { computed, ref } from 'vue'
import { singleton } from '@/shared/presentation/state/singleton'
import { Flota } from '../../domain/model/Flota'
import { trackingUseCases as uc } from '../../infrastructure/container'

/** Estado compartido de la flota; arranca la simulación al usarse por primera vez. */
export const useFlota = singleton(() => {
  const flota = ref(new Flota())
  const codigoPropio = ref<string | null>(null)

  const unidades = computed(() => flota.value.unidades)
  const alertas = computed(() => flota.value.alertas)

  function iniciarSimulacion() {
    setInterval(() => uc.avanzarSimulacion.execute(flota.value), 2000)
    setInterval(() => void uc.generarAlertaAleatoria.execute(flota.value, codigoPropio.value), 20000)
  }

  uc.cargarFlota.execute(flota.value).then(iniciarSimulacion)

  return {
    unidades,
    alertas,
    setCodigoPropio: (codigo: string | null) => { codigoPropio.value = codigo },
    getUnidadByCodigo: (codigo: string) => flota.value.buscarPorCodigo(codigo),
    moverUnidadPorDistancia: (codigo: string, deltaKm: number) =>
      uc.moverUnidad.execute(flota.value, codigo, deltaKm),
    dispararPanico: (codigo: string) => uc.dispararPanico.execute(flota.value, codigo),
    resolverAlerta: (id: number) => uc.resolverAlerta.execute(flota.value, id),
  }
})
