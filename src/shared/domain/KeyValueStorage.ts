/** Puerto de almacenamiento clave-valor (lo implementa localStorage en infraestructura). */
export interface KeyValueStorage {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
}
