import type { Flota } from '../domain/model/Flota'
import type { AlertasRepository } from '../domain/repositories/AlertasRepository'
import type { FlotaRemotaRepository } from '../domain/repositories/FlotaRemotaRepository'

export class ResolverAlerta {
  constructor(
    private readonly remoto: FlotaRemotaRepository,
    private readonly alertas: AlertasRepository,
  ) {}

  execute(flota: Flota, id: number): void {
    if (!flota.resolverAlerta(id)) return
    this.alertas.guardar(flota.alertas)
    if (id > 0) this.remoto.resolverAlerta(id).catch(() => {})
  }
}
