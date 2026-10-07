import { Conductor, type ConductorProps } from '../../domain/model/Conductor'
import type { ConductorRepository } from '../../domain/repositories/ConductorRepository'
import { environment } from '@/shared/infrastructure/config/environment'
import { httpClient } from '@/shared/infrastructure/http/HttpClient'

/** Lee los conductores del fake API: GET /conductores?codigoEmpleado=EMP-001 */
export class JsonServerConductorRepository implements ConductorRepository {
  constructor(private readonly baseUrl = environment.apiBaseUrl) {}

  async buscarPorCodigo(codigoEmpleado: string): Promise<Conductor | null> {
    const lista = await httpClient.get<ConductorProps[]>(
      `${this.baseUrl}/conductores?codigoEmpleado=${encodeURIComponent(codigoEmpleado)}`,
    )
    const dto = (lista ?? []).find((c) => c.codigoEmpleado === codigoEmpleado)
    return dto ? new Conductor(dto) : null
  }
}
