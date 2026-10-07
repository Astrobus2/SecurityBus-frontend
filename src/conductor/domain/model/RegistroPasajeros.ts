/** Entidad de solo lectura: lectura histórica del conteo de pasajeros. */
export interface RegistroPasajeros {
  id: number
  totalAbordaron: number
  totalBajaron: number
  totalAbordo: number
  timestamp: Date | null
  anomalia: boolean
}
