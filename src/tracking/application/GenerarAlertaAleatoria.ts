import type { NivelAlerta } from '../domain/model/AlertaFlota'
import type { Flota } from '../domain/model/Flota'
import type { LevantarAlerta } from './LevantarAlerta'

const TIPOS: { tipo: string; nivel: NivelAlerta }[] = [
  { tipo: 'PÁNICO', nivel: 'CRITICO' },
  { tipo: 'VELOCIDAD', nivel: 'ALTO' },
  { tipo: 'DESVÍO', nivel: 'MEDIO' },
]

export class GenerarAlertaAleatoria {
  constructor(private readonly levantarAlerta: LevantarAlerta) {}

  async execute(flota: Flota, codigoPropio: string | null, azar: () => number = Math.random): Promise<void> {
    if (azar() > 0.3) return
    const candidatas = flota.candidatasParaAlerta(codigoPropio)
    if (candidatas.length === 0) return
    const unidad = candidatas[Math.floor(azar() * candidatas.length)]!
    const { tipo, nivel } = TIPOS[Math.floor(azar() * TIPOS.length)]!
    await this.levantarAlerta.execute(flota, unidad, tipo, nivel)
  }
}
