import type { ConductorAdmin } from '../domain/model/ConductorAdmin'
import type { AdministracionRepository } from '../domain/repositories/AdministracionRepository'

export class ListarConductores {
  constructor(private readonly repo: AdministracionRepository) {}

  /** Filtra por nombre, apellido o DNI (sin filtro devuelve todos). */
  execute(busqueda = ''): ConductorAdmin[] {
    const t = busqueda.toLowerCase()
    return this.repo
      .conductores()
      .filter((c) => c.nombre.toLowerCase().includes(t) || c.apellido.toLowerCase().includes(t) || c.dni.includes(t))
  }
}
