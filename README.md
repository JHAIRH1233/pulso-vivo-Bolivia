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

La API requiere un proveedor compatible con OpenAI Chat Completions. Copia `.env.example` como `.env` en la raíz y configura `LLM_API_KEY`, `LLM_BASE_URL` (raíz de la API del proveedor, por ejemplo `https://api.openai.com/v1`) y `LLM_MODEL`. El endpoint requiere `x-institution-api-key`, configurada como `INSTITUTION_API_KEY`.

El endpoint es `POST http://localhost:3001/api/gap-detector/analyze` y recibe un cuerpo JSON como:

```json
{
  "text": "Comunicado institucional que se desea analizar."
}
```

Devuelve hallazgos de información faltante y ambigüedades. No requiere base de datos.

## Simplificador

Usa el mismo proveedor LLM y las mismas variables `LLM_API_KEY`, `LLM_BASE_URL` y `LLM_MODEL` del Gap Detector. El endpoint `POST http://localhost:3001/api/simplifier/simplify` recibe:

```json
{
  "text": "Texto institucional que se desea simplificar."
}
```

Devuelve `{ "simplifiedText": "..." }` en español claro, conservando el sentido y los datos del original. Requiere `x-institution-api-key`, configurada como `INSTITUTION_API_KEY`, y no requiere base de datos.

## Comunicados

La API expone solo comunicados publicados; no ofrece operaciones de escritura sin autenticación.

- `GET /api/communiques?limit=20&offset=0` lista comunicados publicados con paginación (límite entre 1 y 100).
- `GET /api/communiques/:slug` devuelve el contenido y las traducciones de un comunicado publicado. Los borradores, archivados o inexistentes responden `404`.

Estos endpoints requieren que `DATABASE_URL` apunte a PostgreSQL y que las migraciones estén aplicadas. La conexión es bajo demanda, por lo que el resto de la API puede iniciar sin conectar a la base de datos.

## Web pública

La web obtiene los comunicados publicados desde la API (`/`, `/c/:slug`) y permite enviar preguntas (`/preguntar`). En la página de cada comunicado se puede consultar el asistente, solicitar traducción al quechua y generar audio. Las preguntas ciudadanas se guardan con estado `PENDING`; el asistente no guarda las preguntas. Las traducciones generadas automáticamente deben ser revisadas por hablantes antes de usarse como instrucciones oficiales.

Configura la conexión de Next.js creando `apps/web/.env.local` a partir de `apps/web/.env.example`. `API_BASE_URL` debe apuntar a la API e incluir `/api` (por defecto `http://localhost:3001/api`).

## Panel institucional

El panel disponible en `/dashboard` permite revisar comunicados, analizar brechas, agrupar preguntas y administrar aclaraciones. Para habilitarlo, configura `INSTITUTION_API_KEY` tanto en el entorno de la API como en `apps/web/.env.local`. El acceso web requiere además `INSTITUTION_DASHBOARD_PASSWORD` y un `INSTITUTION_SESSION_SECRET` aleatorio de al menos 32 caracteres; la sesión usa una cookie HttpOnly de ocho horas. La clave de API nunca se envía al navegador. Protege estas variables y usa un proveedor de identidad institucional en despliegues de producción.

## Preguntas

`POST /api/questions` recibe preguntas ciudadanas y las guarda con estado `PENDING` para revisión. El cuerpo admite `text` (obligatorio, máximo 2.000 caracteres), `language` (`ES` o `QU`, predeterminado `ES`) y `communiqueId` (UUID opcional, solo si corresponde a un comunicado publicado). No hay endpoints públicos para leer o responder preguntas pendientes.

## Radar de confusión

`POST /api/confusion-radar/analyze` agrupa preguntas pendientes por tema; el cuerpo puede incluir `communiqueId` para limitar el análisis a un comunicado. Se analizan hasta 100 preguntas y se requiere el proveedor LLM. `GET /api/confusion-radar/clusters` lista los grupos activos sin exponer el texto de las preguntas.

Ambos endpoints requieren el encabezado `x-institution-api-key`, cuyo valor debe configurarse como `INSTITUTION_API_KEY`. Si la clave no está configurada, los endpoints responden `503`; una clave ausente o incorrecta responde `401`. No envíes datos personales en las preguntas.

## Aclaraciones institucionales

Las rutas para administrar aclaraciones requieren `x-institution-api-key`. `POST /api/clarifications` crea un borrador manual; opcionalmente puede vincularse con `clusterId` o con un `communiqueId` publicado. `POST /api/clarifications/drafts/from-cluster` genera una propuesta usando el resumen del grupo y el comunicado publicado asociado, sin enviar los textos originales de las preguntas al proveedor LLM.

La revisión se realiza mediante `GET /api/clarifications`, `PATCH /api/clarifications/:id` (solo borradores) y `POST /api/clarifications/:id/submit-for-review`. Solo una aclaración en revisión puede publicarse mediante `POST /api/clarifications/:id/publish`. La ruta pública `GET /api/clarifications/published` devuelve únicamente aclaraciones publicadas; admite el filtro opcional `communiqueId`. Las propuestas generadas por IA requieren edición y aprobación institucional antes de hacerse públicas.

## Asistente ciudadano

`POST /api/assistant/answer` responde una pregunta usando únicamente un comunicado publicado identificado por su `communiqueSlug`. El cuerpo admite `question` (máximo 2.000 caracteres) y `communiqueSlug` (máximo 180 caracteres). La respuesta incluye el texto, un fragmento textual de respaldo cuando existe y el comunicado utilizado. Las preguntas no se guardan; se envían junto con el contenido publicado al proveedor LLM configurado. No incluyas datos personales.

## Traducción y audio

La traducción usa el proveedor LLM configurado con `LLM_API_KEY`, `LLM_BASE_URL` y `LLM_MODEL`. `POST /api/translation/to-quechua` recibe `{ "text": "..." }` (máximo 20.000 caracteres) y devuelve `{ "translatedText": "..." }` en quechua boliviano.

La síntesis usa OpenAI Text-to-Speech y requiere `TTS_API_KEY`. `POST /api/audio/synthesize` recibe `{ "text": "..." }` (máximo 4.000 caracteres) y devuelve `{ "audioBase64": "...", "mimeType": "audio/mpeg" }`. El audio se genera bajo demanda y no se guarda. La calidad de pronunciación en quechua debe validarse con hablantes antes de producción.
