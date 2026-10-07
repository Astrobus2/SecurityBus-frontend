import type { TurnoHistorial } from '../domain/model/TurnoHistorial'
import type { HistorialTurnosRepository } from '../domain/repositories/HistorialTurnosRepository'
import { conductorUseCases } from '@/conductor/infrastructure/container'

const MUESTRA: TurnoHistorial[] = [
  { id: -1, conductor: 'Marcos E. Silva', bus: 'ABC-1234', ruta: 'R-42', fecha: '2025-04-25', distancia: 32.5, pasajeros: 45, recaudacion: 890,  estado: 'FINALIZADO' },
  { id: -2, conductor: 'Juan Quispe',     bus: 'DEF-5678', ruta: 'R-15', fecha: '2025-04-25', distancia: 28.0, pasajeros: 38, recaudacion: 760,  estado: 'FINALIZADO' },
  { id: -3, conductor: 'Pedro Mamani',    bus: 'GHI-9012', ruta: 'R-07', fecha: '2025-04-26', distancia: 15.2, pasajeros: 22, recaudacion: 440,  estado: 'ALERTA' },
  { id: -4, conductor: 'Miguel Flores',   bus: 'JKL-3456', ruta: 'R-22', fecha: '2025-04-26', distancia: 40.0, pasajeros: 60, recaudacion: 1200, estado: 'FINALIZADO' },
  { id: -5, conductor: 'Marcos E. Silva', bus: 'ABC-1234', ruta: 'R-42', fecha: '2025-04-24', distancia: 33.1, pasajeros: 50, recaudacion: 1000, estado: 'FINALIZADO' },
]

/** Turnos reales cerrados en este navegador (localStorage) seguidos de los de muestra. */
export class CombinedHistorialTurnosRepository implements HistorialTurnosRepository {
  listar(): TurnoHistorial[] {
    const reales = conductorUseCases.listarTurnosArchivados.execute().map<TurnoHistorial>((t) => ({
      id: t.id,
      conductor: t.conductorNombre,
      bus: t.busId,
      ruta: t.rutaNombre,
      fecha: (t.fechaFin ?? t.fechaInicio).toISOString().slice(0, 10),
      distancia: t.distanciaKm,
      pasajeros: t.pasajeros,
      recaudacion: t.recaudacion,
      estado: t.estado,
    }))
    return [...reales, ...MUESTRA]
  }
}
