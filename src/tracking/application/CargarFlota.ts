import { Flota } from '../domain/model/Flota'
import type { AlertasRepository } from '../domain/repositories/AlertasRepository'
import type { FlotaRemotaRepository } from '../domain/repositories/FlotaRemotaRepository'

export class CargarFlota {
  constructor(
    private readonly remoto: FlotaRemotaRepository,
    private readonly alertas: AlertasRepository,
  ) {}

  async execute(flota: Flota): Promise<void> {
    const [unidades, empleados] = await Promise.all([
      this.remoto.obtenerUnidades(),
      this.remoto.obtenerEmpleadoIds(),
    ])
    if (empleados) flota.registrarEmpleados(empleados)
    flota.cargarUnidades(unidades && unidades.length > 0 ? unidades : Flota.respaldo())
    flota.restaurarAlertas(this.alertas.listar())
  }
}
