import type { Turno } from '../model/Turno'

export interface TurnoRepository {
  obtenerActivo(): Turno | null
  guardarActivo(turno: Turno): void
  limpiarActivo(): void
  archivar(turno: Turno): void
  listarArchivados(): Turno[]
}
