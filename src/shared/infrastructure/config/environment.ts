/** 'remote' = backend real (Railway) · 'json-server' = fake API local (server/db.json). */
export type ApiMode = 'remote' | 'json-server'

const env = (import.meta.env ?? {}) as Partial<ImportMetaEnv>

export const environment = {
  apiMode: (env.VITE_API_MODE === 'json-server' ? 'json-server' : 'remote') as ApiMode,
  apiBaseUrl: env.VITE_API_BASE_URL ?? 'https://safebus-backend-production.up.railway.app/api/v1',
}
