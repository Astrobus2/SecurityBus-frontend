import { AlertaFlota, type AlertaFlotaProps } from '../../domain/model/AlertaFlota'
import type { AlertasRepository } from '../../domain/repositories/AlertasRepository'
import type { KeyValueStorage } from '@/shared/domain/KeyValueStorage'

const CLAVE = 'tracking:alertas'
const MAX_ALERTAS = 50

export class LocalStorageAlertasRepository implements AlertasRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  listar(): AlertaFlota[] {
    return (this.storage.get<AlertaFlotaProps[]>(CLAVE) ?? []).map((s) => new AlertaFlota(s))
  }

  guardar(alertas: AlertaFlota[]): void {
    this.storage.set(CLAVE, alertas.slice(0, MAX_ALERTAS).map((a) => a.toSnapshot()))
  }
}
