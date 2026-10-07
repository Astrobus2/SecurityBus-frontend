import type { Flota } from '../domain/model/Flota'
import type { FlotaRemotaRepository } from '../domain/repositories/FlotaRemotaRepository'

export class MoverUnidad {
  constructor(private readonly remoto: FlotaRemotaRepository) {}

  execute(flota: Flota, codigoEmpleado: string, deltaKm: number): void {
    const u = flota.moverPorDistancia(codigoEmpleado, deltaKm)
    if (u?.esReal) this.remoto.guardarUbicacion(u.id, u.lat, u.lng).catch(() => {})
  }
}
