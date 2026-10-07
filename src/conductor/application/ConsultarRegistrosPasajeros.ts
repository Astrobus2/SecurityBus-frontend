import type { RegistroPasajeros } from '../domain/model/RegistroPasajeros'
import type { RegistroPasajerosRepository } from '../domain/repositories/RegistroPasajerosRepository'

export class ConsultarRegistrosPasajeros {
  constructor(private readonly registros: RegistroPasajerosRepository) {}

  execute(cantidad = 5): Promise<RegistroPasajeros[]> {
    return this.registros.ultimos(cantidad)
  }
}
