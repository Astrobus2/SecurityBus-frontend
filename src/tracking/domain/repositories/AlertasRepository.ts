import type { AlertaFlota } from '../model/AlertaFlota'

export interface AlertasRepository {
  listar(): AlertaFlota[]
  guardar(alertas: AlertaFlota[]): void
}
