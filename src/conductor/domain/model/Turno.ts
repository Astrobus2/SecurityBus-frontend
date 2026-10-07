export type EstadoTurno = 'ACTIVO' | 'FINALIZADO'

export interface TurnoSnapshot {
  id: number
  conductorId: number
  conductorNombre: string
  busId: string
  rutaNombre: string
  rutaOrigen: string
  rutaDestino: string
  distanciaKm: number
  tiempoSegundos: number
  pasajeros: number
  recaudacion: number
  estado: EstadoTurno
  fechaInicio: string
  fechaFin: string | null
}

/** Entidad (raíz de agregado): un turno de servicio del conductor. */
export class Turno {
  id!: number
  conductorId!: number
  conductorNombre!: string
  busId!: string
  rutaNombre!: string
  rutaOrigen!: string
  rutaDestino!: string
  distanciaKm = 0
  tiempoSegundos = 0
  pasajeros = 0
  recaudacion = 0
  estado: EstadoTurno = 'ACTIVO'
  fechaInicio!: Date
  fechaFin: Date | null = null

  private constructor(props: Partial<Turno>) {
    Object.assign(this, props)
  }

  static iniciar(conductorId: number, conductorNombre: string, busId: string, ahora = new Date()): Turno {
    return new Turno({
      id: ahora.getTime(), conductorId, conductorNombre, busId,
      rutaNombre: 'R-42', rutaOrigen: 'Terminal Norte', rutaDestino: 'Estación Central',
      fechaInicio: ahora,
    })
  }

  /** Avanza un segundo de servicio. */
  avanzar(deltaKm: number, azar: () => number = Math.random): void {
    if (this.estado !== 'ACTIVO') return
    this.tiempoSegundos += 1
    this.distanciaKm = +(this.distanciaKm + deltaKm).toFixed(3)
    if (this.tiempoSegundos % 15 === 0) {
      this.pasajeros += Math.floor(azar() * 3)
      this.recaudacion = +(this.recaudacion + azar() * 2.5).toFixed(2)
    }
  }

  registrarPasajeros(total: number): void {
    this.pasajeros = Math.max(0, total)
  }

  /** Recupera el tiempo transcurrido si la página estuvo cerrada o recargada. */
  sincronizarReloj(ahora: Date): void {
    if (this.estado !== 'ACTIVO') return
    const transcurrido = Math.floor((ahora.getTime() - this.fechaInicio.getTime()) / 1000)
    if (transcurrido > this.tiempoSegundos) this.tiempoSegundos = transcurrido
  }

  finalizar(ahora = new Date()): void {
    this.estado = 'FINALIZADO'
    this.fechaFin = ahora
  }

  toSnapshot(): TurnoSnapshot {
    return {
      id: this.id, conductorId: this.conductorId, conductorNombre: this.conductorNombre,
      busId: this.busId, rutaNombre: this.rutaNombre, rutaOrigen: this.rutaOrigen,
      rutaDestino: this.rutaDestino, distanciaKm: this.distanciaKm,
      tiempoSegundos: this.tiempoSegundos, pasajeros: this.pasajeros,
      recaudacion: this.recaudacion, estado: this.estado,
      fechaInicio: this.fechaInicio.toISOString(),
      fechaFin: this.fechaFin ? this.fechaFin.toISOString() : null,
    }
  }

  static desdeSnapshot(s: TurnoSnapshot): Turno {
    return new Turno({
      ...s,
      fechaInicio: new Date(s.fechaInicio),
      fechaFin: s.fechaFin ? new Date(s.fechaFin) : null,
    })
  }
}
