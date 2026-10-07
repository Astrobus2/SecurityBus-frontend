import { ASIGNACION_PLACAS } from '../../domain/model/asignacionPlacas'
import { UnidadFlota, type EstadoUnidad } from '../../domain/model/UnidadFlota'
import type { FlotaRemotaRepository, NuevaAlertaRemota } from '../../domain/repositories/FlotaRemotaRepository'
import { environment } from '@/shared/infrastructure/config/environment'
import { httpClient } from '@/shared/infrastructure/http/HttpClient'

interface UnidadDto {
  id: number
  placa: string
  conductor: string
  ruta: string
  estado: EstadoUnidad
  lat: number
  lng: number
  pasajeros: number
  velocidad: number
}
interface ConductorDto {
  id: number
  codigoEmpleado: string
}

const INTERVALO_UBICACION_MS = 10_000

/** El fake API usa tipos sin tilde ("PANICO", "DESVIO"). */
const quitarTildes = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/**
 * Fake API con json-server. Escribe en server/db.json, así que las
 * ubicaciones se guardan como máximo cada 10 s por unidad para no saturar el archivo.
 */
export class JsonServerFlotaRemotaRepository implements FlotaRemotaRepository {
  private readonly ultimaEscritura = new Map<number, number>()

  constructor(private readonly baseUrl = environment.apiBaseUrl) {}

  async obtenerUnidades(): Promise<UnidadFlota[] | null> {
    try {
      const lista = await httpClient.get<UnidadDto[]>(`${this.baseUrl}/unidades`)
      return (lista ?? []).map(
        (u) =>
          new UnidadFlota({
            id: u.id, placa: u.placa, ruta: u.ruta, estado: u.estado,
            conductor: ASIGNACION_PLACAS[u.placa]?.nombre ?? u.conductor,
            codigoEmpleado: ASIGNACION_PLACAS[u.placa]?.codigoEmpleado ?? '',
            lat: u.lat, lng: u.lng, pasajeros: u.pasajeros, velocidad: u.velocidad,
          }),
      )
    } catch {
      return null
    }
  }

  async obtenerEmpleadoIds(): Promise<Map<string, number> | null> {
    try {
      const lista = await httpClient.get<ConductorDto[]>(`${this.baseUrl}/conductores`)
      return new Map((lista ?? []).map((c) => [c.codigoEmpleado, c.id]))
    } catch {
      return null
    }
  }

  async guardarUbicacion(unidadId: number, lat: number, lng: number): Promise<void> {
    const ahora = Date.now()
    if (ahora - (this.ultimaEscritura.get(unidadId) ?? 0) < INTERVALO_UBICACION_MS) return
    this.ultimaEscritura.set(unidadId, ahora)
    await httpClient.patch(`${this.baseUrl}/unidades/${unidadId}`, { lat, lng })
  }

  async registrarAlerta(a: NuevaAlertaRemota): Promise<number | null> {
    const r = await httpClient.post<{ id: number } | null>(`${this.baseUrl}/alertas`, {
      conductorId: a.employeeId,
      turnoId: 0, // el contexto de tracking no conoce el turno
      tipo: quitarTildes(a.alertType),
      nivelRiesgo: a.nivel,
      latitud: a.latitude,
      longitud: a.longitude,
      timestamp: new Date().toISOString(),
      descripcion: a.description,
      resuelta: false,
    })
    return r ? r.id : null
  }

  async resolverAlerta(id: number): Promise<void> {
    await httpClient.patch(`${this.baseUrl}/alertas/${id}`, { resuelta: true })
  }
}
