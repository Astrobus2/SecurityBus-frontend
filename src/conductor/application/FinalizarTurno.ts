import type { Turno } from '../domain/model/Turno'
import type { TurnoRepository } from '../domain/repositories/TurnoRepository'

/** Cierra el turno y lo archiva en el historial local. */
export class FinalizarTurno {
  constructor(private readonly turnos: TurnoRepository) {}

  execute(turno: Turno): void {
    turno.finalizar()
    this.turnos.archivar(turno)
    this.turnos.limpiarActivo()
  }
}
