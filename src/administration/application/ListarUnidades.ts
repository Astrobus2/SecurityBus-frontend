import type { UnidadAdmin } from '../domain/model/UnidadAdmin'
import type { AdministracionRepository } from '../domain/repositories/AdministracionRepository'

export class ListarUnidades {
  constructor(private readonly repo: AdministracionRepository) {}

  execute(): UnidadAdmin[] {
    return this.repo.unidades()
  }
}
