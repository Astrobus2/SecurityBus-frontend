import type { NivelAlerta } from '../domain/model/AlertaFlota'
import type { Flota } from '../domain/model/Flota'
import type { UnidadFlota } from '../domain/model/UnidadFlota'
import type { AlertasRepository } from '../domain/repositories/AlertasRepository'
import type { FlotaRemotaRepository } from '../domain/repositories/FlotaRemotaRepository'

export class LevantarAlerta {
  constructor(
    private readonly remoto: FlotaRemotaRepository,
    private readonly alertas: AlertasRepository,
  ) {}

  async execute(flota: Flota, unidad: UnidadFlota, tipo: string, nivel: NivelAlerta): Promise<void> {
    // Primero local (la interfaz no espera a la red) y persistida en localStorage.
    const alerta = flota.levantarAlerta(unidad, tipo, nivel)
    this.alertas.guardar(flota.alertas)

    const employeeId = flota.idEmpleado(unidad.codigoEmpleado)
    if (employeeId === undefined || !unidad.esReal) return // sin ids reales, queda solo local

    const idReal = await this.remoto
      .registrarAlerta({
        employeeId,
        busUnitId: unidad.id,
        alertType: tipo,
        nivel,
        description: `Alerta ${tipo} generada en unidad ${unidad.placa}`,
        latitude: unidad.lat,
        longitude: unidad.lng,
      })
      .catch(() => null)
    if (idReal === null) return
    flota.confirmarIdAlerta(alerta.id, idReal)
    this.alertas.guardar(flota.alertas)
  }
}
