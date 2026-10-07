import { Turno } from '../domain/model/Turno'
import type { Conductor } from '../domain/model/Conductor'
import type { TurnoRepository } from '../domain/repositories/TurnoRepository'

export class IniciarTurno {
  constructor(private readonly turnos: TurnoRepository) {}

  execute(conductor: Conductor, busId: string): Turno {
    const turno = Turno.iniciar(conductor.id, conductor.nombreCompleto, busId)
    this.turnos.guardarActivo(turno)
    return turno
  }
}
