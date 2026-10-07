# SecurityBus | UrbanGuard — Frontend

Vue 3 + Vite + TypeScript, con arquitectura **DDD** y desplegado en **Cloudflare**.

## Ejecutar

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # typecheck (vue-tsc) + build en dist/
```

## API: fake (json-server) o backend real

`npm run dev` usa el **fake API** (`server/db.json`); el build de producción usa el backend real.
Se elige con `VITE_API_MODE` (`.env.development` y `.env`):

```bash
npm run api      # terminal 1: json-server en http://localhost:3000/api/v1
npm run dev      # terminal 2: la app
```

| Modo | Dónde se define | Adaptadores |
|---|---|---|
| `json-server` | `.env.development` (por defecto en `npm run dev`) | `*/infrastructure/json-server/` |
| `remote` | `.env` (por defecto en `npm run build` / Cloudflare) | `*/infrastructure/http/` |

Los casos de uso y el dominio no cambian: solo cambia el adaptador que conecta cada puerto
(`container.ts`). Con json-server, las posiciones de las unidades se escriben en
`server/db.json` como máximo cada 10 s por unidad.

> json-server necesita un servidor Node, así que **no corre en Cloudflare**. Si quieres usar
> el fake API ya desplegado, hospédalo aparte (Render, Railway…) y en Cloudflare define
> `VITE_API_MODE=json-server` y `VITE_API_BASE_URL=<url>/api/v1`.

## Deploy en Cloudflare (Workers + assets estáticos)

`wrangler.jsonc` ya está listo: sirve `dist/` y usa `single-page-application`, así que
las rutas de Vue Router funcionan al recargar o abrir un enlace directo.

**Desde tu computadora**

```bash
npx wrangler login
npm run deploy       # build + wrangler deploy
```

**Desde GitHub (despliegue automático)**: en el dashboard de Cloudflare → *Workers & Pages* →
*Create* → *Import a repository* y configura:

| Campo | Valor |
|---|---|
| Root directory | carpeta de este proyecto |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Variables de build | `VITE_API_MODE` y `VITE_API_BASE_URL` (solo si difieren de `.env`) |

> El backend (Railway) debe permitir por CORS el dominio `*.workers.dev` / tu dominio de Cloudflare.

## Arquitectura (DDD)

Tres *bounded contexts* + un *shared kernel*. Cada contexto tiene sus capas:

```
src/
  conductor/        identidad, sesión y turno del conductor
  tracking/         flota, simulación de movimiento y alertas
  administration/   panel de administración (consultas)
  shared/           puerto de almacenamiento, cliente HTTP, utilidades de UI
    └─ <contexto>/
         domain/          entidades, agregados y puertos (interfaces de repositorio)
         application/     casos de uso (una clase por caso: IniciarSesion, FinalizarTurno…)
         infrastructure/  adaptadores: http/ (API), storage/ (localStorage), container.ts
         presentation/    componentes Vue, vistas y estado de UI
```

Regla de dependencias: `presentation → application → domain ← infrastructure`.
El dominio no importa Vue ni nada de infraestructura. `container.ts` es la raíz de
composición donde cada puerto se conecta con su adaptador.

## localStorage

Se accede **solo** desde `shared/infrastructure/storage/LocalStorageAdapter.ts`
(implementa el puerto `KeyValueStorage`; claves con prefijo `securitybus:v1:`).

| Clave | Qué guarda | Repositorio |
|---|---|---|
| `conductor:sesion` | conductor autenticado | `LocalStorageSesionRepository` |
| `conductor:turno-activo` | turno en curso (se guarda cada 5 s) | `LocalStorageTurnoRepository` |
| `conductor:turnos` | turnos finalizados (máx. 50) | `LocalStorageTurnoRepository` |
| `tracking:alertas` | alertas de la flota (máx. 50) | `LocalStorageAlertasRepository` |

Al abrir la app, `main.ts` restaura la sesión y el turno; si recargas en medio de un
turno, el cronómetro continúa donde iba. Los turnos finalizados aparecen en
*Historial de turnos* (admin) antes de los datos de muestra.
