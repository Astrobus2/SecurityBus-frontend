import type { Turno } from '../domain/model/Turno'
import type { TurnoRepository } from '../domain/repositories/TurnoRepository'

export class RegistrarPasajeros {
  constructor(private readonly turnos: TurnoRepository) {}

  execute(turno: Turno, total: number): void {
    turno.registrarPasajeros(total)
    this.turnos.guardarActivo(turno)
  }
}
