import type { RegistroPasajeros } from '../../domain/model/RegistroPasajeros'
import type { RegistroPasajerosRepository } from '../../domain/repositories/RegistroPasajerosRepository'
import { environment } from '@/shared/infrastructure/config/environment'
import { httpClient } from '@/shared/infrastructure/http/HttpClient'

interface RegistroDto {
  id: number
  totalAbordaron?: number
  totalBajaron?: number
  totalAbordo?: number
  timestamp?: string
  anomalia?: boolean
}

export class HttpRegistroPasajerosRepository implements RegistroPasajerosRepository {
  async ultimos(cantidad: number): Promise<RegistroPasajeros[]> {
    const lista = await httpClient.get<RegistroDto[]>(`${environment.apiBaseUrl}/bus-units`)
    return (lista ?? []).slice(-cantidad).map((r) => ({
      id: r.id,
      totalAbordaron: r.totalAbordaron ?? 0,
      totalBajaron: r.totalBajaron ?? 0,
      totalAbordo: r.totalAbordo ?? 0,
      timestamp: r.timestamp ? new Date(r.timestamp) : null,
      anomalia: r.anomalia ?? false,
    }))
  }
}
