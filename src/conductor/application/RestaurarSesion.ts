import type { Conductor } from '../domain/model/Conductor'
import type { Turno } from '../domain/model/Turno'
import type { SesionRepository } from '../domain/repositories/SesionRepository'
import type { TurnoRepository } from '../domain/repositories/TurnoRepository'

export interface SesionRestaurada {
  conductor: Conductor
  turno: Turno | null
}

/** Al abrir la app recupera, desde localStorage, la sesión y el turno en curso. */
export class RestaurarSesion {
  constructor(
    private readonly sesiones: SesionRepository,
    private readonly turnos: TurnoRepository,
  ) {}

  execute(ahora = new Date()): SesionRestaurada | null {
    const conductor = this.sesiones.obtener()
    if (!conductor) return null
    const turno = this.turnos.obtenerActivo()
    if (turno && turno.conductorId !== conductor.id) {
      this.turnos.limpiarActivo()
      return { conductor, turno: null }
    }
    turno?.sincronizarReloj(ahora)
    return { conductor, turno }
  }
}
