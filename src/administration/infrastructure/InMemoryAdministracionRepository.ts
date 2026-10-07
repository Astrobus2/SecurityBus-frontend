import type { ConductorAdmin } from '../domain/model/ConductorAdmin'
import type { UnidadAdmin } from '../domain/model/UnidadAdmin'
import type { AdministracionRepository } from '../domain/repositories/AdministracionRepository'

/** Datos de muestra para el panel de administración. */
export class InMemoryAdministracionRepository implements AdministracionRepository {
  conductores(): ConductorAdmin[] {
    return [
      { id: 1, nombre: 'MARCOS E.', apellido: 'SILVA',  dni: '12345678', codigoEmpleado: 'EMP-001', codigoQr: 'QR-SF-90210-TX', placa: 'ABC-1234', estado: 'ACTIVO',   foto: 'https://i.pravatar.cc/80?img=11' },
      { id: 2, nombre: 'JUAN',      apellido: 'QUISPE', dni: '23456789', codigoEmpleado: 'EMP-002', codigoQr: 'QR-SF-90211-TX', placa: 'DEF-5678', estado: 'ACTIVO',   foto: 'https://i.pravatar.cc/80?img=12' },
      { id: 3, nombre: 'PEDRO',     apellido: 'MAMANI', dni: '34567890', codigoEmpleado: 'EMP-003', codigoQr: 'QR-SF-90212-TX', placa: 'GHI-9012', estado: 'INACTIVO', foto: 'https://i.pravatar.cc/80?img=13' },
      { id: 4, nombre: 'MIGUEL',    apellido: 'FLORES', dni: '45678901', codigoEmpleado: 'EMP-004', codigoQr: 'QR-SF-90213-TX', placa: 'JKL-3456', estado: 'ACTIVO',   foto: 'https://i.pravatar.cc/80?img=14' },
      { id: 5, nombre: 'LUIS',      apellido: 'CCAMA',  dni: '56789012', codigoEmpleado: 'EMP-005', codigoQr: 'QR-SF-90214-TX', placa: 'MNO-7890', estado: 'ACTIVO',   foto: 'https://i.pravatar.cc/80?img=15' },
      { id: 6, nombre: 'CARLOS',    apellido: 'HUANCA', dni: '67890123', codigoEmpleado: 'EMP-006', codigoQr: 'QR-SF-90215-TX', placa: 'PQR-1234', estado: 'ACTIVO',   foto: 'https://i.pravatar.cc/80?img=16' },
      { id: 7, nombre: 'ROBERTO',   apellido: 'APAZA',  dni: '78901234', codigoEmpleado: 'EMP-007', codigoQr: 'QR-SF-90216-TX', placa: 'STU-5678', estado: 'ACTIVO',   foto: 'https://i.pravatar.cc/80?img=17' },
    ]
  }

  unidades(): UnidadAdmin[] {
    return [
      { id: 1, placa: 'ABC-1234', conductor: 'Marcos E. Silva', ruta: 'R-42', estado: 'ACTIVO',   pasajeros: 32, velocidad: 48 },
      { id: 2, placa: 'DEF-5678', conductor: 'Juan Quispe',     ruta: 'R-15', estado: 'ACTIVO',   pasajeros: 18, velocidad: 52 },
      { id: 3, placa: 'GHI-9012', conductor: 'Pedro Mamani',    ruta: 'R-07', estado: 'ALERTA',   pasajeros: 45, velocidad: 75 },
      { id: 4, placa: 'JKL-3456', conductor: 'Miguel Flores',   ruta: 'R-22', estado: 'ACTIVO',   pasajeros: 10, velocidad: 40 },
      { id: 5, placa: 'MNO-7890', conductor: 'Luis Ccama',      ruta: 'R-33', estado: 'INACTIVO', pasajeros: 0,  velocidad: 0 },
      { id: 6, placa: 'PQR-1234', conductor: 'Carlos Huanca',   ruta: 'R-42', estado: 'ACTIVO',   pasajeros: 27, velocidad: 55 },
      { id: 7, placa: 'STU-5678', conductor: 'Roberto Apaza',   ruta: 'R-08', estado: 'ACTIVO',   pasajeros: 38, velocidad: 43 },
    ]
  }
}
