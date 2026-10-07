export type EstadoUnidadAdmin = 'ACTIVO' | 'INACTIVO' | 'ALERTA'

export interface UnidadAdmin {
  id: number
  placa: string
  conductor: string
  ruta: string
  estado: EstadoUnidadAdmin
  pasajeros: number
  velocidad: number
}
