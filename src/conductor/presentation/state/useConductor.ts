import { computed, ref } from 'vue'
import { singleton } from '@/shared/presentation/state/singleton'
import { formatTime } from '@/shared/presentation/format'
import { useFlota } from '@/tracking/presentation/state/useFlota'
import type { Conductor } from '../../domain/model/Conductor'
import type { Turno } from '../../domain/model/Turno'
import { conductorUseCases as uc } from '../../infrastructure/container'

const DELTA_KM_POR_SEGUNDO = 0.003

/** Estado de la sesión del conductor y de su turno; la lógica vive en los casos de uso. */
export const useConductor = singleton(() => {
  const flota = useFlota()

  const conductorActual = ref<Conductor | null>(null)
  const turnoActual = ref<Turno | null>(null)
  const turnoActivo = ref(false)

  const tiempoStr = computed(() => formatTime(turnoActual.value?.tiempoSegundos ?? 0))
  const distanciaKm = computed(() => turnoActual.value?.distanciaKm ?? 0)
  const pasajeros = computed(() => turnoActual.value?.pasajeros ?? 0)
  const recaudacion = computed(() => turnoActual.value?.recaudacion ?? 0)

  let timer: ReturnType<typeof setInterval> | null = null

  function establecerConductor(c: Conductor) {
    conductorActual.value = c
    flota.setCodigoPropio(c.codigoEmpleado)
  }

  function iniciarTimer() {
    detenerTimer()
    timer = setInterval(() => {
      const turno = turnoActual.value
      if (!turnoActivo.value || !turno) return
      uc.avanzarTurno.execute(turno, DELTA_KM_POR_SEGUNDO)
      const codigo = conductorActual.value?.codigoEmpleado
      if (codigo) flota.moverUnidadPorDistancia(codigo, DELTA_KM_POR_SEGUNDO)
    }, 1000)
  }

  function detenerTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  /** Recupera sesión y turno guardados en localStorage (se llama al arrancar la app). */
  function restaurar() {
    const r = uc.restaurarSesion.execute()
    if (!r) return
    establecerConductor(r.conductor)
    if (r.turno) {
      turnoActual.value = r.turno
      turnoActivo.value = true
      iniciarTimer()
    }
  }

  async function iniciarSesion(codigoEmpleado: string): Promise<Conductor | null> {
    const conductor = await uc.iniciarSesion.execute(codigoEmpleado)
    if (conductor) {
      detenerTimer()
      turnoActual.value = null
      turnoActivo.value = false
      establecerConductor(conductor)
    }
    return conductor
  }

  function cerrarSesion() {
    uc.cerrarSesion.execute()
    conductorActual.value = null
    turnoActual.value = null
    turnoActivo.value = false
    flota.setCodigoPropio(null)
    detenerTimer()
  }

  function iniciarTurno(busId: string) {
    const c = conductorActual.value
    if (!c) return
    turnoActual.value = uc.iniciarTurno.execute(c, busId)
    turnoActivo.value = true
    iniciarTimer()
  }

  function registrarPasajeros(total: number) {
    if (turnoActual.value) uc.registrarPasajeros.execute(turnoActual.value, total)
  }

  function finalizarTurno() {
    if (turnoActual.value) uc.finalizarTurno.execute(turnoActual.value)
    turnoActivo.value = false
    detenerTimer()
  }

  /** Turno a mostrar en el resumen: el recién cerrado o, tras recargar, el último archivado. */
  function turnoParaResumen(): Turno | null {
    return turnoActual.value ?? uc.listarTurnosArchivados.execute()[0] ?? null
  }

  return {
    conductorActual, turnoActual, turnoActivo,
    tiempoStr, distanciaKm, pasajeros, recaudacion,
    restaurar, iniciarSesion, cerrarSesion, iniciarTurno,
    registrarPasajeros, finalizarTurno, turnoParaResumen,
  }
})
