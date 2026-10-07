import type { RegistroPasajeros } from '../model/RegistroPasajeros'

export interface RegistroPasajerosRepository {
  ultimos(cantidad: number): Promise<RegistroPasajeros[]>
}
