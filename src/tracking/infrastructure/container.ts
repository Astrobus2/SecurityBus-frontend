import { environment } from '@/shared/infrastructure/config/environment'
import { almacenamiento } from '@/shared/infrastructure/storage/LocalStorageAdapter'
import { HttpFlotaRemotaRepository } from './http/HttpFlotaRemotaRepository'
import { JsonServerFlotaRemotaRepository } from './json-server/JsonServerFlotaRemotaRepository'
import { LocalStorageAlertasRepository } from './storage/LocalStorageAlertasRepository'
import { CargarFlota } from '../application/CargarFlota'
import { AvanzarSimulacion } from '../application/AvanzarSimulacion'
import { MoverUnidad } from '../application/MoverUnidad'
import { LevantarAlerta } from '../application/LevantarAlerta'
import { GenerarAlertaAleatoria } from '../application/GenerarAlertaAleatoria'
import { DispararPanico } from '../application/DispararPanico'
import { ResolverAlerta } from '../application/ResolverAlerta'

const remoto =
  environment.apiMode === 'json-server' ? new JsonServerFlotaRemotaRepository() : new HttpFlotaRemotaRepository()
const alertas = new LocalStorageAlertasRepository(almacenamiento)
const levantarAlerta = new LevantarAlerta(remoto, alertas)

export const trackingUseCases = {
  cargarFlota: new CargarFlota(remoto, alertas),
  avanzarSimulacion: new AvanzarSimulacion(remoto),
  moverUnidad: new MoverUnidad(remoto),
  levantarAlerta,
  generarAlertaAleatoria: new GenerarAlertaAleatoria(levantarAlerta),
  dispararPanico: new DispararPanico(levantarAlerta),
  resolverAlerta: new ResolverAlerta(remoto, alertas),
}
