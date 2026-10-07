import { Conductor, type ConductorProps } from '../../domain/model/Conductor'
import type { SesionRepository } from '../../domain/repositories/SesionRepository'
import type { KeyValueStorage } from '@/shared/domain/KeyValueStorage'

const CLAVE = 'conductor:sesion'

export class LocalStorageSesionRepository implements SesionRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  obtener(): Conductor | null {
    const s = this.storage.get<ConductorProps>(CLAVE)
    return s ? new Conductor(s) : null
  }

  guardar(conductor: Conductor): void {
    this.storage.set(CLAVE, conductor.toSnapshot())
  }

  limpiar(): void {
    this.storage.remove(CLAVE)
  }
}
