import type { ConductorAdmin } from '../model/ConductorAdmin'
import type { UnidadAdmin } from '../model/UnidadAdmin'

export interface AdministracionRepository {
  conductores(): ConductorAdmin[]
  unidades(): UnidadAdmin[]
}
