import type { UnidadFlota } from '../model/UnidadFlota'

export interface NuevaAlertaRemota {
  employeeId: number
  busUnitId: number
  alertType: string
  nivel: string
  description: string
  latitude: number
  longitude: number
}

export interface FlotaRemotaRepository {
  /** null si el backend no responde. */
  obtenerUnidades(): Promise<UnidadFlota[] | null>
  /** codigoEmpleado → id del empleado; null si el backend no responde. */
  obtenerEmpleadoIds(): Promise<Map<string, number> | null>
  guardarUbicacion(unidadId: number, lat: number, lng: number): Promise<void>
  /** Devuelve el id real de la alerta, o null si falló. */
  registrarAlerta(alerta: NuevaAlertaRemota): Promise<number | null>
  resolverAlerta(id: number): Promise<void>
}
