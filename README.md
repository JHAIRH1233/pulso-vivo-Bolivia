# pulso-vivo-Bolivia
Plataforma desarrollada para la Hackatón Bolivia 2026"

## Base de datos

La API usa PostgreSQL 16. El esquema versionado con Prisma está en `apps/api/prisma/schema.prisma`; incluye comunicados, traducciones y preguntas. Gap Detector no persiste sus análisis.

Configura `DATABASE_URL` en `.env` en la raíz del monorepo o en `apps/api/.env`, y asegúrate de que PostgreSQL esté disponible. Desde la raíz:

```bash
pnpm --filter api db:generate
pnpm --filter api db:migrate:dev
```

En entornos de despliegue, aplica migraciones pendientes con `pnpm --filter api db:migrate:deploy`.

## Gap Detector

La API requiere un proveedor compatible con OpenAI Chat Completions. Copia `.env.example` como `.env` en la raíz y configura `LLM_API_KEY`, `LLM_BASE_URL` (raíz de la API del proveedor, por ejemplo `https://api.openai.com/v1`) y `LLM_MODEL`.

El endpoint es `POST http://localhost:3001/api/gap-detector/analyze` y recibe un cuerpo JSON como:

```json
{
  "text": "Comunicado institucional que se desea analizar."
}
```

Devuelve hallazgos de información faltante y ambigüedades. No requiere base de datos.
