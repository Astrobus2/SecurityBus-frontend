export type EstadoUnidad = 'ACTIVO' | 'INACTIVO' | 'ALERTA'

export interface UnidadFlotaProps {
  id: number // id real en el backend; negativo = unidad de respaldo local
  placa: string
  conductor: string
  codigoEmpleado: string
  ruta: string
  estado: EstadoUnidad
  lat: number
  lng: number
  pasajeros: number
  velocidad: number
}

/** Entidad: un bus de la flota con su posición y estado. */
export class UnidadFlota {
  id!: number
  placa!: string
  conductor!: string
  codigoEmpleado!: string
  ruta!: string
  estado!: EstadoUnidad
  lat!: number
  lng!: number
  pasajeros!: number
  velocidad!: number

  constructor(props: UnidadFlotaProps) {
    Object.assign(this, props)
  }

  get esReal(): boolean {
    return this.id > 0
  }

  moverA(lat: number, lng: number): void {
    this.lat = lat
    this.lng = lng
  }

  entrarEnAlerta(): void {
    this.estado = 'ALERTA'
  }

  volverAActiva(): void {
    if (this.estado === 'ALERTA') this.estado = 'ACTIVO'
  }
}
