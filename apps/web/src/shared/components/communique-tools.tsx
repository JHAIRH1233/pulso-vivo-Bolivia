'use client';

import { FormEvent, useState } from 'react';
import { PublicCommunique } from '../api/public-communiques';

type Version = 'official' | 'simple' | 'quechua';

interface AudioResult {
  audioBase64: string;
  mimeType: 'audio/mpeg';
}

interface AssistantResult {
  answer: string;
  evidence: string | null;
}

export function CommuniqueTools({
  slug,
  title,
  content,
  simplifiedContent,
  translations,
}: Pick<
  PublicCommunique,
  'slug' | 'title' | 'content' | 'simplifiedContent' | 'translations'
>) {
  const savedQuechua = translations.find(
    (translation) => translation.language === 'QU',
  );
  const [version, setVersion] = useState<Version>('official');
  const [translatedText, setTranslatedText] = useState(
    savedQuechua?.content ?? '',
  );
  const [versionError, setVersionError] = useState('');
  const [versionBusy, setVersionBusy] = useState(false);
  const [audio, setAudio] = useState<AudioResult | null>(null);
  const [audioError, setAudioError] = useState('');
  const [audioBusy, setAudioBusy] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<AssistantResult | null>(null);
  const [assistantError, setAssistantError] = useState('');
  const [assistantBusy, setAssistantBusy] = useState(false);

  const selectedText =
    version === 'simple'
      ? simplifiedContent ?? ''
      : version === 'quechua'
        ? translatedText
        : content;

  async function translate() {
    setVersionBusy(true);
    setVersionError('');
    try {
      const response = await fetch('/api/translation/to-quechua', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: content }),
      });
      if (!response.ok) {
        throw new Error('No se pudo traducir el comunicado.');
      }
      const result: unknown = await response.json();
      if (!isRecord(result) || typeof result['translatedText'] !== 'string') {
        throw new Error('El servicio devolvió una traducción no válida.');
      }
      setTranslatedText(result['translatedText']);
    } catch (error) {
      console.error('Could not translate communique', error);
      setVersionError(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el servicio de traducción.',
      );
    } finally {
      setVersionBusy(false);
    }
  }

  async function synthesizeAudio() {
    setAudioBusy(true);
    setAudioError('');
    setAudio(null);
    try {
      const response = await fetch('/api/audio/synthesize', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: selectedText }),
      });
      if (!response.ok) {
        throw new Error('No se pudo generar el audio.');
      }
      const result: unknown = await response.json();
      if (
        !isRecord(result) ||
        typeof result['audioBase64'] !== 'string' ||
        result['mimeType'] !== 'audio/mpeg'
      ) {
        throw new Error('El servicio devolvió un audio no válido.');
      }
      setAudio({
        audioBase64: result['audioBase64'],
        mimeType: 'audio/mpeg',
      });
    } catch (error) {
      console.error('Could not synthesize communique audio', error);
      setAudioError(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el servicio de audio.',
      );
    } finally {
      setAudioBusy(false);
    }
  }

  async function askAssistant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) {
      setAssistantError('Escribe una pregunta antes de continuar.');
      return;
    }

    setAssistantBusy(true);
    setAssistantError('');
    setAnswer(null);
    try {
      const response = await fetch('/api/assistant/answer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), communiqueSlug: slug }),
      });
      if (!response.ok) {
        throw new Error('No se pudo responder usando este comunicado.');
      }
      const result: unknown = await response.json();
      if (
        !isRecord(result) ||
        typeof result['answer'] !== 'string' ||
        !(typeof result['evidence'] === 'string' || result['evidence'] === null)
      ) {
        throw new Error('El servicio devolvió una respuesta no válida.');
      }
      setAnswer({
        answer: result['answer'],
        evidence: result['evidence'],
      });
    } catch (error) {
      console.error('Could not answer question about communique', error);
      setAssistantError(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el asistente.',
      );
    } finally {
      setAssistantBusy(false);
    }
  }

  function chooseVersion(nextVersion: Version) {
    setVersion(nextVersion);
    setVersionError('');
    setAudio(null);
    setAudioError('');
  }

  return (
    <section className="communique-tools" aria-label="Herramientas del comunicado">
      <div className="version-preview">
        <div className="version-picker" role="group" aria-label="Versión del texto">
          <button
            type="button"
            aria-pressed={version === 'official'}
            onClick={() => chooseVersion('official')}
          >
            Español
          </button>
          <button
            type="button"
            aria-pressed={version === 'simple'}
            onClick={() => chooseVersion('simple')}
            disabled={!simplifiedContent}
          >
            Simple
          </button>
          <button
            type="button"
            aria-pressed={version === 'quechua'}
            onClick={() => chooseVersion('quechua')}
          >
            Quechua
          </button>
        </div>
        <article className="version-card" aria-live="polite">
          <div className="version-card__meta">
            <span>{version === 'quechua' ? 'Quechua' : title}</span>
            {version === 'quechua' && !savedQuechua && translatedText && (
              <span className="category-tag">Traducción automática</span>
            )}
          </div>
          {version === 'simple' && simplifiedContent ? (
            <p>{simplifiedContent}</p>
          ) : version === 'quechua' ? (
            translatedText ? (
              <p>{translatedText}</p>
            ) : (
              <div>
                <p>
                  No hay una traducción publicada para este comunicado.
                  Solicita una propuesta automática para revisarla.
                </p>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={translate}
                  disabled={versionBusy}
                >
                  {versionBusy ? 'Traduciendo…' : 'Generar traducción'}
                </button>
              </div>
            )
          ) : (
            <p>{content}</p>
          )}
          {versionError && (
            <p className="form-message" role="alert">
              {versionError}
            </p>
          )}
          {version === 'quechua' && translatedText && !savedQuechua && (
            <p className="form-note">
              Traducción automática sin revisión comunitaria. Verifica los
              detalles importantes con la institución.
            </p>
          )}
          <div className="version-card__actions">
            <button
              className="listen-button"
              type="button"
              onClick={synthesizeAudio}
              disabled={
                audioBusy ||
                !selectedText ||
                selectedText.length > 4_000
              }
            >
              {audioBusy ? 'Generando audio…' : 'Generar audio'}
            </button>
            {selectedText.length > 4_000 && (
              <span>El audio está disponible para textos de hasta 4.000 caracteres.</span>
            )}
          </div>
          {audioError && (
            <p className="form-message" role="alert">
              {audioError}
            </p>
          )}
          {audio && (
            <audio
              controls
              preload="none"
              src={`data:${audio.mimeType};base64,${audio.audioBase64}`}
            >
              Tu navegador no puede reproducir este audio.
            </audio>
          )}
        </article>
      </div>

      <div className="dashboard-panel communique-assistant">
        <h2>Pregunta sobre este comunicado</h2>
        <p>
          La respuesta se basa solo en el contenido publicado. No incluyas
          datos personales.
        </p>
        <form className="question-form" onSubmit={askAssistant}>
          <div className="form-field">
            <label htmlFor="communique-question">Tu pregunta</label>
            <textarea
              id="communique-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={2_000}
              required
              rows={3}
            />
          </div>
          <button
            className="button button--primary"
            type="submit"
            disabled={assistantBusy}
          >
            {assistantBusy ? 'Buscando respuesta…' : 'Consultar'}
          </button>
        </form>
        {assistantError && (
          <p className="form-message" role="alert">
            {assistantError}
          </p>
        )}
        {answer && (
          <div className="assistant-answer" role="status">
            <h3>Respuesta</h3>
            <p>{answer.answer}</p>
            {answer.evidence && (
              <blockquote className="dashboard-evidence">
                “{answer.evidence}”
              </blockquote>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
