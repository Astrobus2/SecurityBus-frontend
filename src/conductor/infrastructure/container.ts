import { environment } from '@/shared/infrastructure/config/environment'
import { almacenamiento } from '@/shared/infrastructure/storage/LocalStorageAdapter'
import { HttpConductorRepository } from './http/HttpConductorRepository'
import { HttpRegistroPasajerosRepository } from './http/HttpRegistroPasajerosRepository'
import { JsonServerConductorRepository } from './json-server/JsonServerConductorRepository'
import { JsonServerRegistroPasajerosRepository } from './json-server/JsonServerRegistroPasajerosRepository'
import { LocalStorageSesionRepository } from './storage/LocalStorageSesionRepository'
import { LocalStorageTurnoRepository } from './storage/LocalStorageTurnoRepository'
import { IniciarSesion } from '../application/IniciarSesion'
import { CerrarSesion } from '../application/CerrarSesion'
import { RestaurarSesion } from '../application/RestaurarSesion'
import { IniciarTurno } from '../application/IniciarTurno'
import { AvanzarTurno } from '../application/AvanzarTurno'
import { RegistrarPasajeros } from '../application/RegistrarPasajeros'
import { FinalizarTurno } from '../application/FinalizarTurno'
import { ListarTurnosArchivados } from '../application/ListarTurnosArchivados'
import { ConsultarRegistrosPasajeros } from '../application/ConsultarRegistrosPasajeros'

// Raíz de composición del contexto: aquí se conectan los puertos con sus adaptadores.
const usaFakeApi = environment.apiMode === 'json-server'
const conductores = usaFakeApi ? new JsonServerConductorRepository() : new HttpConductorRepository()
const registros = usaFakeApi ? new JsonServerRegistroPasajerosRepository() : new HttpRegistroPasajerosRepository()
const sesiones = new LocalStorageSesionRepository(almacenamiento)
const turnos = new LocalStorageTurnoRepository(almacenamiento)

export const conductorUseCases = {
  iniciarSesion: new IniciarSesion(conductores, sesiones, turnos),
  cerrarSesion: new CerrarSesion(sesiones, turnos),
  restaurarSesion: new RestaurarSesion(sesiones, turnos),
  iniciarTurno: new IniciarTurno(turnos),
  avanzarTurno: new AvanzarTurno(turnos),
  registrarPasajeros: new RegistrarPasajeros(turnos),
  finalizarTurno: new FinalizarTurno(turnos),
  listarTurnosArchivados: new ListarTurnosArchivados(turnos),
  consultarRegistrosPasajeros: new ConsultarRegistrosPasajeros(registros),
}
