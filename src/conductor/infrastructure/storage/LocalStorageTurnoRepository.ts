import { Turno, type TurnoSnapshot } from '../../domain/model/Turno'
import type { TurnoRepository } from '../../domain/repositories/TurnoRepository'
import type { KeyValueStorage } from '@/shared/domain/KeyValueStorage'

const CLAVE_ACTIVO = 'conductor:turno-activo'
const CLAVE_ARCHIVO = 'conductor:turnos'
const MAX_ARCHIVADOS = 50

export class LocalStorageTurnoRepository implements TurnoRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  obtenerActivo(): Turno | null {
    const s = this.storage.get<TurnoSnapshot>(CLAVE_ACTIVO)
    return s ? Turno.desdeSnapshot(s) : null
  }

  guardarActivo(turno: Turno): void {
    this.storage.set(CLAVE_ACTIVO, turno.toSnapshot())
  }

  limpiarActivo(): void {
    this.storage.remove(CLAVE_ACTIVO)
  }

  archivar(turno: Turno): void {
    const previos = this.storage.get<TurnoSnapshot[]>(CLAVE_ARCHIVO) ?? []
    this.storage.set(CLAVE_ARCHIVO, [turno.toSnapshot(), ...previos].slice(0, MAX_ARCHIVADOS))
  }

  listarArchivados(): Turno[] {
    return (this.storage.get<TurnoSnapshot[]>(CLAVE_ARCHIVO) ?? []).map(Turno.desdeSnapshot)
  }
}
