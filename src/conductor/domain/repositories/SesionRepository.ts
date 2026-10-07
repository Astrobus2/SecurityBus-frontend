import type { Conductor } from '../model/Conductor'

export interface SesionRepository {
  obtener(): Conductor | null
  guardar(conductor: Conductor): void
  limpiar(): void
}
