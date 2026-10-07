import type { RegistroPasajeros } from '../../domain/model/RegistroPasajeros'
import type { RegistroPasajerosRepository } from '../../domain/repositories/RegistroPasajerosRepository'
import { environment } from '@/shared/infrastructure/config/environment'
import { httpClient } from '@/shared/infrastructure/http/HttpClient'

interface PasajerosDto {
  id: number
  totalAbordaron: number
  totalBajaron: number
  totalAbordo: number
  timestamp: string
  anomalia: boolean
}

/** Lee los registros del fake API: GET /pasajeros */
export class JsonServerRegistroPasajerosRepository implements RegistroPasajerosRepository {
  constructor(private readonly baseUrl = environment.apiBaseUrl) {}

  async ultimos(cantidad: number): Promise<RegistroPasajeros[]> {
    const lista = await httpClient.get<PasajerosDto[]>(`${this.baseUrl}/pasajeros`)
    return (lista ?? []).slice(-cantidad).map((r) => ({
      id: r.id,
      totalAbordaron: r.totalAbordaron,
      totalBajaron: r.totalBajaron,
      totalAbordo: r.totalAbordo,
      timestamp: new Date(r.timestamp),
      anomalia: r.anomalia,
    }))
  }
}
