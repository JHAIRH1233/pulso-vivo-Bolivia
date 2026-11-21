# Guion de demostración

Duración sugerida: 4 minutos. Presentar los datos web como ejemplos, no como comunicados oficiales.

## Antes de empezar

- Iniciar PostgreSQL, aplicar migraciones y disponer de un comunicado publicado si se mostrará el asistente.
- Configurar `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL` y, para audio, `TTS_API_KEY`.
- Iniciar la API y la web según [la guía de instalación](../setup.md).
- No mostrar claves, datos personales ni información institucional confidencial.

## Recorrido

### 1. La experiencia pública (45 segundos)

Abrir `http://localhost:3000`. Mostrar la portada y aclarar que los comunicados son ejemplos. Abrir uno para enseñar cómo se presenta el contenido en lenguaje claro.

### 2. Revisar un comunicado (60 segundos)

Enviar un texto ficticio a `POST /api/gap-detector/analyze`. Mostrar los campos `missingInformation` y `ambiguities`; explicar que la herramienta sugiere puntos de revisión y no sustituye la decisión de la institución.

### 3. Preguntar con contexto (45 segundos)

Si hay un comunicado publicado en la base de datos, enviar una pregunta a `POST /api/assistant/answer` con su `communiqueSlug`. Mostrar la respuesta y la evidencia textual. Si no hay datos preparados, omitir esta llamada y mostrar la ruta pública de preguntas, indicando que su formulario es una simulación.

### 4. Idioma y audio (60 segundos)

Enviar el texto ficticio a `POST /api/translation/to-quechua`. Con el resultado, llamar a `POST /api/audio/synthesize` y reproducir el MP3 decodificado desde `audioBase64`. Aclarar que la traducción y la voz deben revisarse con hablantes antes de una publicación real.

### 5. Cierre (30 segundos)

Recalcar que Rimay apoya la revisión y accesibilidad, pero la institución verifica y aprueba el contenido. Mencionar como siguientes pasos la validación comunitaria, el almacenamiento del audio y la integración del dashboard, el radar y las aclaraciones.

## Ejemplos de cuerpos JSON

`POST /api/gap-detector/analyze`:

```json
{
  "text": "La jornada será este viernes. La atención es gratuita."
}
```

`POST /api/assistant/answer`:

```json
{
  "question": "¿Cuánto cuesta la atención?",
  "communiqueSlug": "slug-de-un-comunicado-publicado"
}
```

`POST /api/translation/to-quechua`:

```json
{
  "text": "La jornada será este viernes. La atención es gratuita."
}
```

`POST /api/audio/synthesize`:

```json
{
  "text": "Texto en quechua devuelto por la traducción."
}
```
