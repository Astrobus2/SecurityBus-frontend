import type { Flota } from '../domain/model/Flota'
import type { LevantarAlerta } from './LevantarAlerta'

export class DispararPanico {
  constructor(private readonly levantarAlerta: LevantarAlerta) {}

  async execute(flota: Flota, codigoEmpleado: string): Promise<void> {
    const unidad = flota.buscarPorCodigo(codigoEmpleado)
    if (!unidad) return
    await this.levantarAlerta.execute(flota, unidad, 'PÁNICO', 'CRITICO')
  }
}
