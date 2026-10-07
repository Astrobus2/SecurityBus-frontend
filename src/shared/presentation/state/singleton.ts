import { reactive, type UnwrapNestedRefs } from 'vue'

/**
 * Crea un estado compartido (una sola instancia para toda la app).
 * Los refs/computed del objeto devuelto se leen sin `.value`.
 */
export function singleton<T extends object>(factory: () => T): () => UnwrapNestedRefs<T> {
  let instancia: UnwrapNestedRefs<T> | undefined
  return () => (instancia ??= reactive(factory()))
}
