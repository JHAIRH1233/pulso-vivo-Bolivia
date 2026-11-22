'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface Cluster {
  id: string;
  title: string;
  summary: string;
  questionCount: number;
  status: 'ACTIVE' | 'RESOLVED';
  updatedAt: string;
}

export function ConfusionRadarPanel() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [analyzedCount, setAnalyzedCount] = useState<number | null>(null);

  const loadClusters = useCallback(async () => {
    const response = await fetch('/api/confusion-radar/clusters', {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(
        response.status === 401 || response.status === 503
          ? 'La sesión expiró o falta configurar INSTITUTION_API_KEY en la API y en apps/web/.env.local.'
          : 'No se pudieron cargar los temas del radar.',
      );
    }
    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error('El servicio devolvió una lista de temas no válida.');
    }
    setClusters(payload.map(parseCluster));
  }, []);

  useEffect(() => {
    void loadClusters().catch((caught: unknown) => {
      console.error('Could not load confusion clusters', caught);
      setError(
        caught instanceof Error ? caught.message : 'No se pudieron cargar los temas.',
      );
    });
  }, [loadClusters]);

  async function analyze() {
    setBusy(true);
    setError('');
    setAnalyzedCount(null);
    try {
      const response = await fetch('/api/confusion-radar/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(
          response.status === 401 || response.status === 503
            ? 'La sesión expiró o falta configurar INSTITUTION_API_KEY en la API y en apps/web/.env.local.'
            : 'No se pudieron analizar las preguntas pendientes.',
        );
      }
      const result: unknown = await response.json();
      if (!isRecord(result) || typeof result['analyzedQuestionCount'] !== 'number') {
        throw new Error('El servicio devolvió un resultado no válido.');
      }
      setAnalyzedCount(result['analyzedQuestionCount']);
      await loadClusters();
    } catch (caught) {
      console.error('Could not analyze confusion clusters', caught);
      setError(
        caught instanceof Error
          ? caught.message
          : 'No se pudieron analizar las preguntas.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dashboard-tool">
      <div className="dashboard-panel dashboard-tool__header">
        <p>
          Se agrupan preguntas pendientes. El panel solo muestra temas y
          cantidades, no el texto individual de las preguntas.
        </p>
        <button
          className="button button--primary"
          type="button"
          onClick={analyze}
          disabled={busy}
        >
          {busy ? 'Analizando…' : 'Analizar preguntas pendientes'}
        </button>
      </div>
      {error && (
        <p className="form-message" role="alert">
          {error}
        </p>
      )}
      {analyzedCount !== null && (
        <p className="form-message" role="status">
          Se analizaron {analyzedCount} preguntas pendientes.
        </p>
      )}
      {clusters.length === 0 ? (
        <p>No hay temas activos para mostrar.</p>
      ) : (
        <div className="dashboard-card-grid">
          {clusters.map((cluster) => (
            <article className="dashboard-panel" key={cluster.id}>
              <div className="dashboard-card__meta">
                <span className="dashboard-status">{cluster.status}</span>
                <span>{cluster.questionCount} preguntas</span>
              </div>
              <h2>{cluster.title}</h2>
              <p>{cluster.summary}</p>
              <Link
                className="text-link"
                href={`/aclaraciones?clusterId=${encodeURIComponent(cluster.id)}`}
              >
                Preparar aclaración <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function parseCluster(value: unknown): Cluster {
  if (
    !isRecord(value) ||
    typeof value['id'] !== 'string' ||
    typeof value['title'] !== 'string' ||
    typeof value['summary'] !== 'string' ||
    typeof value['questionCount'] !== 'number' ||
    (value['status'] !== 'ACTIVE' && value['status'] !== 'RESOLVED') ||
    typeof value['updatedAt'] !== 'string'
  ) {
    throw new Error('El servicio devolvió un tema no válido.');
  }
  return {
    id: value['id'],
    title: value['title'],
    summary: value['summary'],
    questionCount: value['questionCount'],
    status: value['status'],
    updatedAt: value['updatedAt'],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
