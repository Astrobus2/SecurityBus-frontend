import { InMemoryAdministracionRepository } from './InMemoryAdministracionRepository'
import { CombinedHistorialTurnosRepository } from './CombinedHistorialTurnosRepository'
import { ListarConductores } from '../application/ListarConductores'
import { ListarUnidades } from '../application/ListarUnidades'
import { ListarHistorialTurnos } from '../application/ListarHistorialTurnos'

const administracion = new InMemoryAdministracionRepository()
const historial = new CombinedHistorialTurnosRepository()

export const administrationUseCases = {
  listarConductores: new ListarConductores(administracion),
  listarUnidades: new ListarUnidades(administracion),
  listarHistorialTurnos: new ListarHistorialTurnos(historial),
}
