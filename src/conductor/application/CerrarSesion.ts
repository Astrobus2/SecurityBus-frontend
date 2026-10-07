import type { SesionRepository } from '../domain/repositories/SesionRepository'
import type { TurnoRepository } from '../domain/repositories/TurnoRepository'

export class CerrarSesion {
  constructor(
    private readonly sesiones: SesionRepository,
    private readonly turnos: TurnoRepository,
  ) {}

  execute(): void {
    this.sesiones.limpiar()
    this.turnos.limpiarActivo()
  }
}
