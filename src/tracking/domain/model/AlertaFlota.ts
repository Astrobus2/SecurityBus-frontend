export type NivelAlerta = 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO'

export interface AlertaFlotaProps {
  id: number // negativo = provisional, aún sin confirmar por el backend
  tipo: string
  bus: string
  conductor: string
  codigoEmpleado: string
  hora: string
  nivel: NivelAlerta
  resuelta: boolean
  lat: number
  lng: number
}

/** Entidad: alerta levantada por una unidad. */
export class AlertaFlota {
  id!: number
  tipo!: string
  bus!: string
  conductor!: string
  codigoEmpleado!: string
  hora!: string
  nivel!: NivelAlerta
  resuelta!: boolean
  lat!: number
  lng!: number

  constructor(props: AlertaFlotaProps) {
    Object.assign(this, props)
  }

  get esPanico(): boolean {
    return this.tipo === 'PÁNICO'
  }

  resolver(): void {
    this.resuelta = true
  }

  toSnapshot(): AlertaFlotaProps {
    return {
      id: this.id, tipo: this.tipo, bus: this.bus, conductor: this.conductor,
      codigoEmpleado: this.codigoEmpleado, hora: this.hora, nivel: this.nivel,
      resuelta: this.resuelta, lat: this.lat, lng: this.lng,
    }
  }
}
