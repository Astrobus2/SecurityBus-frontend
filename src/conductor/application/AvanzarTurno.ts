import type { Turno } from '../domain/model/Turno'
import type { TurnoRepository } from '../domain/repositories/TurnoRepository'

const GUARDAR_CADA_SEGUNDOS = 5

export class AvanzarTurno {
  constructor(private readonly turnos: TurnoRepository) {}

  execute(turno: Turno, deltaKm: number): void {
    turno.avanzar(deltaKm)
    if (turno.tiempoSegundos % GUARDAR_CADA_SEGUNDOS === 0) this.turnos.guardarActivo(turno)
  }
}
