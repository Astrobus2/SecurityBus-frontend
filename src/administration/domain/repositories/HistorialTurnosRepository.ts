import type { TurnoHistorial } from '../model/TurnoHistorial'

export interface HistorialTurnosRepository {
  listar(): TurnoHistorial[]
}
