import { AlertaFlota, type NivelAlerta } from './AlertaFlota'
import { ASIGNACION_PLACAS } from './asignacionPlacas'
import { UnidadFlota } from './UnidadFlota'

type Azar = () => number

/** Raíz de agregado: la flota con sus unidades, alertas y simulación de movimiento. */
export class Flota {
  unidades: UnidadFlota[] = []
  alertas: AlertaFlota[] = []
  rumbos = new Map<number, number>()
  empleadoIds = new Map<string, number>()

  cargarUnidades(unidades: UnidadFlota[]): void {
    this.unidades = unidades
  }

  /** Unidades de ejemplo para cuando el backend no responde. */
  static respaldo(azar: Azar = Math.random): UnidadFlota[] {
    return Object.entries(ASIGNACION_PLACAS).map(
      ([placa, info], i) =>
        new UnidadFlota({
          id: -(i + 1), placa, conductor: info.nombre, codigoEmpleado: info.codigoEmpleado,
          ruta: 'R-00', estado: 'ACTIVO', lat: -12.05 + azar() * 0.05, lng: -77.05 + azar() * 0.05,
          pasajeros: 20, velocidad: 45,
        }),
    )
  }

  registrarEmpleados(ids: Map<string, number>): void {
    this.empleadoIds = ids
  }

  idEmpleado(codigoEmpleado: string): number | undefined {
    return this.empleadoIds.get(codigoEmpleado)
  }

  /** Restaura alertas guardadas; las pendientes dejan su unidad en estado ALERTA. */
  restaurarAlertas(alertas: AlertaFlota[]): void {
    this.alertas = alertas
    for (const a of alertas) {
      if (!a.resuelta) this.buscarPorPlaca(a.bus)?.entrarEnAlerta()
    }
  }

  buscarPorCodigo(codigoEmpleado: string): UnidadFlota | undefined {
    return this.unidades.find((u) => u.codigoEmpleado === codigoEmpleado)
  }

  buscarPorPlaca(placa: string): UnidadFlota | undefined {
    return this.unidades.find((u) => u.placa === placa)
  }

  /** Mueve todas las unidades activas un paso; devuelve las que cambiaron de posición. */
  avanzarSimulacion(azar: Azar = Math.random): UnidadFlota[] {
    const movidas: UnidadFlota[] = []
    for (const u of this.unidades) {
      if (u.estado === 'INACTIVO') continue
      const rumbo = this.siguienteRumbo(u.id, 0.08, azar)
      const paso = 0.0004
      u.moverA(u.lat + Math.cos(rumbo) * paso, u.lng + Math.sin(rumbo) * paso)
      movidas.push(u)
    }
    return movidas
  }

  /** Mueve la unidad de un conductor según los km recorridos. */
  moverPorDistancia(codigoEmpleado: string, deltaKm: number, azar: Azar = Math.random): UnidadFlota | null {
    const u = this.buscarPorCodigo(codigoEmpleado)
    if (!u || u.estado === 'INACTIVO') return null
    const rumbo = this.siguienteRumbo(u.id, 0.1, azar)
    const paso = deltaKm * 0.03
    u.moverA(u.lat + Math.cos(rumbo) * paso, u.lng + Math.sin(rumbo) * paso)
    return u
  }

  siguienteRumbo(unidadId: number, probCambio: number, azar: Azar): number {
    let rumbo = this.rumbos.get(unidadId)
    if (rumbo === undefined || azar() < probCambio) {
      rumbo = azar() * Math.PI * 2
      this.rumbos.set(unidadId, rumbo)
    }
    return rumbo
  }

  candidatasParaAlerta(codigoPropio: string | null): UnidadFlota[] {
    return this.unidades.filter((u) => u.estado === 'ACTIVO' && u.codigoEmpleado !== codigoPropio)
  }

  levantarAlerta(unidad: UnidadFlota, tipo: string, nivel: NivelAlerta, ahora = new Date()): AlertaFlota {
    unidad.entrarEnAlerta()
    const alerta = new AlertaFlota({
      id: -ahora.getTime(), tipo, bus: unidad.placa, conductor: unidad.conductor,
      codigoEmpleado: unidad.codigoEmpleado,
      hora: ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      nivel, resuelta: false, lat: unidad.lat, lng: unidad.lng,
    })
    this.alertas.unshift(alerta)
    return alerta
  }

  confirmarIdAlerta(provisionalId: number, idReal: number): void {
    const a = this.alertas.find((x) => x.id === provisionalId)
    if (a) a.id = idReal
  }

  resolverAlerta(id: number): AlertaFlota | null {
    const alerta = this.alertas.find((a) => a.id === id)
    if (!alerta) return null
    alerta.resolver()
    this.buscarPorPlaca(alerta.bus)?.volverAActiva()
    return alerta
  }
}
