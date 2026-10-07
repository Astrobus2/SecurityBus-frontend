import type { Conductor } from '../model/Conductor'

export interface ConductorRepository {
  buscarPorCodigo(codigoEmpleado: string): Promise<Conductor | null>
}
