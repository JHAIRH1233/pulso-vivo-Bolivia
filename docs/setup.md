# Guía de instalación

## Requisitos

- Node.js 24 (la versión usada por CI).
- pnpm 12.21.0.
- Docker Compose, si se usará la base de datos local.

Activa Corepack para usar la versión de pnpm fijada en el proyecto:

```sh
corepack enable
corepack prepare pnpm@12.21.0 --activate
```

## Instalación

Desde la raíz del repositorio:

```sh
pnpm install --frozen-lockfile
```

Copia `.env.example` como `.env` en la raíz. En PowerShell:

```powershell
Copy-Item .env.example .env
```

En macOS o Linux:

```sh
cp .env.example .env
```

Configura las variables que necesites:

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | PostgreSQL para migraciones, comunicados y preguntas. |
| `LLM_API_KEY` | Clave del proveedor compatible con OpenAI Chat Completions. |
| `LLM_BASE_URL` | URL base del proveedor LLM; por defecto, OpenAI. |
| `LLM_MODEL` | Modelo usado para análisis, respuestas y traducción. |
| `TTS_API_KEY` | Clave de OpenAI para generar audio. |

No agregues claves reales al repositorio.

## Base de datos local

Si no tienes PostgreSQL disponible, inicia el servicio del repositorio:

```sh
docker compose up -d postgres
```

El servicio crea la base `pulsovivo` con las credenciales locales declaradas en `docker-compose.yml`. Con `DATABASE_URL` configurada en `.env`, genera el cliente Prisma y aplica las migraciones:

```sh
pnpm --filter api db:generate
pnpm --filter api db:migrate:dev
```

`db:generate` necesita que `DATABASE_URL` esté definida, pero no requiere que el servidor PostgreSQL esté conectado. `db:migrate:dev` sí necesita que PostgreSQL esté disponible.

## Ejecutar en desarrollo

Abre dos terminales desde la raíz.

Terminal 1, API:

```sh
pnpm dev:api
```

La API escucha en `http://localhost:3001` y usa el prefijo `/api`.

Terminal 2, web:

```sh
pnpm dev:web
```

La aplicación web estará en `http://localhost:3000`.

## Comprobaciones

Ejecuta las pruebas y builds desde la raíz:

```sh
pnpm --filter api test -- --runInBand
pnpm --filter api build
pnpm --filter web test
pnpm --filter web build
```

La web pública usa contenido de demostración. Las rutas que llaman a proveedores externos requieren las claves correspondientes; las funciones con base de datos también requieren PostgreSQL y migraciones aplicadas.

## Problemas frecuentes

- **Prisma dice que falta `DATABASE_URL`:** revisa que `.env` esté en la raíz y que el valor tenga el formato `postgresql://usuario:contraseña@localhost:5432/base`.
- **No se puede conectar a PostgreSQL:** confirma que `docker compose up -d postgres` terminó correctamente y que el puerto `5432` está disponible.
- **El proveedor LLM responde con error de configuración:** revisa `LLM_API_KEY`, `LLM_BASE_URL` y `LLM_MODEL`.
- **La generación de audio responde que falta configuración:** define `TTS_API_KEY`; la síntesis usa OpenAI Text-to-Speech.
- **El puerto de desarrollo está ocupado:** detén la otra aplicación o configura un puerto disponible con `PORT` para la API; Next.js permite indicar otro puerto al iniciar el servidor.
