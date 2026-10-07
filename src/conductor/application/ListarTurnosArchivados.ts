import type { Turno } from '../domain/model/Turno'
import type { TurnoRepository } from '../domain/repositories/TurnoRepository'

export class ListarTurnosArchivados {
  constructor(private readonly turnos: TurnoRepository) {}

  /** Del más reciente al más antiguo. */
  execute(): Turno[] {
    return this.turnos.listarArchivados()
  }
}
