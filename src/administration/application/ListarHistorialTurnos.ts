import type { TurnoHistorial } from '../domain/model/TurnoHistorial'
import type { HistorialTurnosRepository } from '../domain/repositories/HistorialTurnosRepository'

export class ListarHistorialTurnos {
  constructor(private readonly repo: HistorialTurnosRepository) {}

  execute(): TurnoHistorial[] {
    return this.repo.listar()
  }
}
