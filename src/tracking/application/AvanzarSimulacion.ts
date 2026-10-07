import type { Flota } from '../domain/model/Flota'
import type { FlotaRemotaRepository } from '../domain/repositories/FlotaRemotaRepository'

export class AvanzarSimulacion {
  constructor(private readonly remoto: FlotaRemotaRepository) {}

  execute(flota: Flota): void {
    for (const u of flota.avanzarSimulacion()) {
      if (u.esReal) this.remoto.guardarUbicacion(u.id, u.lat, u.lng).catch(() => {})
    }
  }
}
