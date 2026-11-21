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

## Comunicados

La API expone solo comunicados publicados; no ofrece operaciones de escritura sin autenticación.

- `GET /api/communiques?limit=20&offset=0` lista comunicados publicados con paginación (límite entre 1 y 100).
- `GET /api/communiques/:slug` devuelve el contenido y las traducciones de un comunicado publicado. Los borradores, archivados o inexistentes responden `404`.

Estos endpoints requieren que `DATABASE_URL` apunte a PostgreSQL y que las migraciones estén aplicadas. La conexión es bajo demanda, por lo que el resto de la API puede iniciar sin conectar a la base de datos.

## Web pública

La web pública muestra comunicados y un formulario de preguntas con datos de demostración. Las interacciones no llaman a la API ni guardan preguntas; las rutas de muestra son `/`, `/c/:id` y `/preguntar`.

## Panel institucional

El panel de demostración está disponible en `/dashboard` y sus secciones `/comunicados`, `/brechas`, `/radar` y `/aclaraciones`. Usa datos ilustrativos; no requiere autenticación y no guarda cambios. El radar y las aclaraciones no están conectados a una API.

## Preguntas

`POST /api/questions` recibe preguntas ciudadanas y las guarda con estado `PENDING` para revisión. El cuerpo admite `text` (obligatorio, máximo 2.000 caracteres), `language` (`ES` o `QU`, predeterminado `ES`) y `communiqueId` (UUID opcional, solo si corresponde a un comunicado publicado). No hay endpoints públicos para leer o responder preguntas pendientes.

## Asistente ciudadano

`POST /api/assistant/answer` responde una pregunta usando únicamente un comunicado publicado identificado por su `communiqueSlug`. El cuerpo admite `question` (máximo 2.000 caracteres) y `communiqueSlug` (máximo 180 caracteres). La respuesta incluye el texto, un fragmento textual de respaldo cuando existe y el comunicado utilizado. Las preguntas no se guardan; se envían junto con el contenido publicado al proveedor LLM configurado. No incluyas datos personales.

## Traducción y audio

La traducción usa el proveedor LLM configurado con `LLM_API_KEY`, `LLM_BASE_URL` y `LLM_MODEL`. `POST /api/translation/to-quechua` recibe `{ "text": "..." }` (máximo 20.000 caracteres) y devuelve `{ "translatedText": "..." }` en quechua boliviano.

La síntesis usa OpenAI Text-to-Speech y requiere `TTS_API_KEY`. `POST /api/audio/synthesize` recibe `{ "text": "..." }` (máximo 4.000 caracteres) y devuelve `{ "audioBase64": "...", "mimeType": "audio/mpeg" }`. El audio se genera bajo demanda y no se guarda. La calidad de pronunciación en quechua debe validarse con hablantes antes de producción.
