import type { Conductor } from '../domain/model/Conductor'
import type { ConductorRepository } from '../domain/repositories/ConductorRepository'
import type { SesionRepository } from '../domain/repositories/SesionRepository'
import type { TurnoRepository } from '../domain/repositories/TurnoRepository'

/** Verifica el código de empleado y, si es válido, abre la sesión (persistida). */
export class IniciarSesion {
  constructor(
    private readonly conductores: ConductorRepository,
    private readonly sesiones: SesionRepository,
    private readonly turnos: TurnoRepository,
  ) {}

  async execute(codigoEmpleado: string): Promise<Conductor | null> {
    const conductor = await this.conductores.buscarPorCodigo(codigoEmpleado.trim())
    if (!conductor) return null
    this.turnos.limpiarActivo() // un turno viejo no pertenece a esta sesión
    this.sesiones.guardar(conductor)
    return conductor
  }
}
