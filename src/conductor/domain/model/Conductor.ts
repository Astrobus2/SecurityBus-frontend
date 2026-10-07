export interface ConductorProps {
  id: number
  nombre: string
  apellido: string
  dni: string
  codigoEmpleado: string
  codigoQr: string
  placa: string
  estado: string
  foto: string
}

/** Entidad: persona autorizada a operar una unidad. */
export class Conductor {
  readonly id!: number
  readonly nombre!: string
  readonly apellido!: string
  readonly dni!: string
  readonly codigoEmpleado!: string
  readonly codigoQr!: string
  readonly placa!: string
  readonly estado!: string
  readonly foto!: string

  constructor(props: ConductorProps) {
    Object.assign(this, props)
  }

  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`
  }

  toSnapshot(): ConductorProps {
    return {
      id: this.id, nombre: this.nombre, apellido: this.apellido, dni: this.dni,
      codigoEmpleado: this.codigoEmpleado, codigoQr: this.codigoQr,
      placa: this.placa, estado: this.estado, foto: this.foto,
    }
  }
}
