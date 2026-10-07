import { ASIGNACION_PLACAS } from '../../domain/model/asignacionPlacas'
import { UnidadFlota } from '../../domain/model/UnidadFlota'
import type { FlotaRemotaRepository, NuevaAlertaRemota } from '../../domain/repositories/FlotaRemotaRepository'
import { environment } from '@/shared/infrastructure/config/environment'
import { httpClient } from '@/shared/infrastructure/http/HttpClient'

interface BusUnitDto {
  id: number
  plateNumber: string
  route: string
  currentLatitude: number
  currentLongitude: number
}
interface EmpleadoDto {
  id: number
  employeeCode: string
}

const base = () => environment.apiBaseUrl

export class HttpFlotaRemotaRepository implements FlotaRemotaRepository {
  async obtenerUnidades(): Promise<UnidadFlota[] | null> {
    try {
      const lista = await httpClient.get<BusUnitDto[]>(`${base()}/bus-units`)
      return (lista ?? []).map((u) => {
        const info = ASIGNACION_PLACAS[u.plateNumber] ?? { codigoEmpleado: '', nombre: u.plateNumber }
        return new UnidadFlota({
          id: u.id, placa: u.plateNumber, conductor: info.nombre, codigoEmpleado: info.codigoEmpleado,
          ruta: u.route, estado: 'ACTIVO', lat: u.currentLatitude, lng: u.currentLongitude,
          pasajeros: Math.floor(Math.random() * 40) + 5,
          velocidad: Math.floor(Math.random() * 40) + 35,
        })
      })
    } catch {
      return null
    }
  }

  async obtenerEmpleadoIds(): Promise<Map<string, number> | null> {
    try {
      const lista = await httpClient.get<EmpleadoDto[]>(`${base()}/employees`)
      return new Map((lista ?? []).map((e) => [e.employeeCode, e.id]))
    } catch {
      return null
    }
  }

  async guardarUbicacion(unidadId: number, lat: number, lng: number): Promise<void> {
    await httpClient.patch(`${base()}/bus-units/${unidadId}/location`, { latitude: lat, longitude: lng })
  }

  async registrarAlerta(alerta: NuevaAlertaRemota): Promise<number | null> {
    const { nivel: _nivel, ...cuerpo } = alerta // el backend real no usa el nivel
    const r = await httpClient.post<{ id: number } | null>(`${base()}/alerts`, cuerpo)
    return r ? r.id : null
  }

  async resolverAlerta(id: number): Promise<void> {
    await httpClient.patch(`${base()}/alerts/${id}/resolve`, {})
  }
}
