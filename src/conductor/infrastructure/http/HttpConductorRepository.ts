import { Conductor } from '../../domain/model/Conductor'
import type { ConductorRepository } from '../../domain/repositories/ConductorRepository'
import { environment } from '@/shared/infrastructure/config/environment'
import { httpClient } from '@/shared/infrastructure/http/HttpClient'

interface EmpleadoDto {
  id: number
  fullName?: string
  employeeCode: string
}

export class HttpConductorRepository implements ConductorRepository {
  async buscarPorCodigo(codigoEmpleado: string): Promise<Conductor | null> {
    const dto = await httpClient.get<EmpleadoDto | null>(
      `${environment.apiBaseUrl}/employees/code/${encodeURIComponent(codigoEmpleado)}`,
    )
    return dto ? this.aConductor(dto) : null
  }

  private aConductor(e: EmpleadoDto): Conductor {
    const partes = (e.fullName ?? '').trim().split(' ')
    const nombre = partes.shift() ?? ''
    return new Conductor({
      id: e.id,
      nombre,
      apellido: partes.join(' '),
      dni: '',
      codigoEmpleado: e.employeeCode,
      codigoQr: `QR-${e.employeeCode}`,
      placa: '',
      estado: 'ACTIVO',
      foto: `https://i.pravatar.cc/80?u=${e.employeeCode}`,
    })
  }
}
