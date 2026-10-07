import type { KeyValueStorage } from '@/shared/domain/KeyValueStorage'

/**
 * Adaptador de localStorage con prefijo versionado y respaldo en memoria
 * (por si el navegador bloquea localStorage, p. ej. modo privado).
 */
export class LocalStorageAdapter implements KeyValueStorage {
  private readonly respaldo = new Map<string, string>()

  constructor(private readonly prefijo = 'securitybus:v1:') {}

  get<T>(key: string): T | null {
    try {
      const raw = this.leer(this.prefijo + key)
      return raw === null ? null : (JSON.parse(raw) as T)
    } catch {
      return null // JSON corrupto: se ignora
    }
  }

  set<T>(key: string, value: T): void {
    const raw = JSON.stringify(value)
    try {
      window.localStorage.setItem(this.prefijo + key, raw)
    } catch {
      this.respaldo.set(this.prefijo + key, raw)
    }
  }

  remove(key: string): void {
    try {
      window.localStorage.removeItem(this.prefijo + key)
    } catch {
      /* sin acceso a localStorage */
    }
    this.respaldo.delete(this.prefijo + key)
  }

  private leer(key: string): string | null {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return this.respaldo.get(key) ?? null
    }
  }
}

export const almacenamiento: KeyValueStorage = new LocalStorageAdapter()
