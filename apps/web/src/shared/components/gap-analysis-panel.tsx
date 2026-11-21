'use client';

import { FormEvent, useState } from 'react';

interface GapFinding {
  topic: string;
  explanation: string;
  evidence: string | null;
  clarifyingQuestion: string;
}

interface GapResult {
  missingInformation: GapFinding[];
  ambiguities: GapFinding[];
}

export function GapAnalysisPanel() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<GapResult | null>(null);
  const [simplifiedText, setSimplifiedText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<'gaps' | 'simplify' | null>(null);

  async function run(action: 'gaps' | 'simplify') {
    setBusy(action);
    setError('');
    try {
      const response = await fetch(
        action === 'gaps' ? '/api/gap-detector/analyze' : '/api/simplifier/simplify',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text: text.trim() }),
        },
      );
      if (!response.ok) {
        throw new Error(
          action === 'gaps'
            ? 'No se pudo analizar el comunicado.'
            : 'No se pudo simplificar el comunicado.',
        );
      }
      const payload: unknown = await response.json();
      if (action === 'gaps') {
        setResult(parseGapResult(payload));
      } else {
        if (!isRecord(payload) || typeof payload['simplifiedText'] !== 'string') {
          throw new Error('El servicio devolvió un resultado no válido.');
        }
        setSimplifiedText(payload['simplifiedText']);
      }
    } catch (caught) {
      console.error(`Could not ${action === 'gaps' ? 'analyze' : 'simplify'} text`, caught);
      setError(
        caught instanceof Error
          ? caught.message
          : 'No se pudo conectar con el servicio.',
      );
    } finally {
      setBusy(null);
    }
  }

  function submitGaps(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run('gaps');
  }

  return (
    <div className="dashboard-tool">
      <form className="dashboard-panel" onSubmit={submitGaps}>
        <div className="form-field">
          <label htmlFor="announcement-text">Texto del comunicado</label>
          <textarea
            id="announcement-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={20_000}
            required
            rows={8}
          />
          <span className="form-field__meta">
            Máximo 20.000 caracteres · {text.length}/20.000
          </span>
        </div>
        <div className="dashboard-tool__actions">
          <button
            className="button button--primary"
            type="submit"
            disabled={!text.trim() || busy !== null}
          >
            {busy === 'gaps' ? 'Analizando…' : 'Analizar información faltante'}
          </button>
          <button
            className="button button--secondary"
            type="button"
            disabled={!text.trim() || busy !== null}
            onClick={() => void run('simplify')}
          >
            {busy === 'simplify' ? 'Simplificando…' : 'Crear versión simple'}
          </button>
        </div>
      </form>

      {error && (
        <p className="form-message" role="alert">
          {error}
        </p>
      )}
      {result && (
        <div className="dashboard-card-grid">
          <GapList title="Información faltante" findings={result.missingInformation} />
          <GapList title="Ambigüedades" findings={result.ambiguities} />
        </div>
      )}
      {simplifiedText && (
        <article className="dashboard-panel">
          <h2>Versión simple propuesta</h2>
          <p>{simplifiedText}</p>
          <p className="form-note">
            Revisa y confirma que todos los datos coincidan con el texto
            institucional antes de publicar.
          </p>
        </article>
      )}
    </div>
  );
}

function GapList({
  title,
  findings,
}: {
  title: string;
  findings: GapFinding[];
}) {
  return (
    <section className="dashboard-panel">
      <h2>{title}</h2>
      {findings.length === 0 ? (
        <p>No se encontraron elementos en esta categoría.</p>
      ) : (
        findings.map((finding, index) => (
          <article className="gap-finding" key={`${finding.topic}-${index}`}>
            <h3>{finding.topic}</h3>
            <p>{finding.explanation}</p>
            {finding.evidence && (
              <blockquote className="dashboard-evidence">
                “{finding.evidence}”
              </blockquote>
            )}
            <p>
              <strong>Pregunta sugerida:</strong> {finding.clarifyingQuestion}
            </p>
          </article>
        ))
      )}
    </section>
  );
}

function parseGapResult(value: unknown): GapResult {
  if (!isRecord(value)) {
    throw new Error('El servicio devolvió un resultado no válido.');
  }
  return {
    missingInformation: parseFindings(value['missingInformation']),
    ambiguities: parseFindings(value['ambiguities']),
  };
}

function parseFindings(value: unknown): GapFinding[] {
  if (!Array.isArray(value)) {
    throw new Error('El servicio devolvió hallazgos no válidos.');
  }
  return value.map((finding) => {
    if (
      !isRecord(finding) ||
      typeof finding['topic'] !== 'string' ||
      typeof finding['explanation'] !== 'string' ||
      !(typeof finding['evidence'] === 'string' || finding['evidence'] === null) ||
      typeof finding['clarifyingQuestion'] !== 'string'
    ) {
      throw new Error('El servicio devolvió un hallazgo no válido.');
    }
    return {
      topic: finding['topic'],
      explanation: finding['explanation'],
      evidence: finding['evidence'],
      clarifyingQuestion: finding['clarifyingQuestion'],
    };
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
