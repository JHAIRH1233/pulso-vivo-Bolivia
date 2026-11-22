'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

type ClarificationStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED';

interface ReviewClarification {
  id: string;
  title: string;
  content: string;
  status: ClarificationStatus;
  clusterId: string | null;
  cluster: { id: string; title: string } | null;
  communique: { slug: string; title: string } | null;
}

interface ClusterOption {
  id: string;
  title: string;
}

export function ClarificationsPanel({
  initialClusterId = '',
}: {
  initialClusterId?: string;
}) {
  const [clarifications, setClarifications] = useState<ReviewClarification[]>([]);
  const [clusters, setClusters] = useState<ClusterOption[]>([]);
  const [clusterId, setClusterId] = useState(initialClusterId);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loadData = useCallback(async () => {
    const [clarificationsResponse, clustersResponse] = await Promise.all([
      fetch('/api/clarifications', { cache: 'no-store' }),
      fetch('/api/confusion-radar/clusters', { cache: 'no-store' }),
    ]);
    if (!clarificationsResponse.ok || !clustersResponse.ok) {
      const status = !clarificationsResponse.ok
        ? clarificationsResponse.status
        : clustersResponse.status;
      throw new Error(
        status === 401 || status === 503
          ? 'La sesión expiró o falta configurar INSTITUTION_API_KEY en la API y en apps/web/.env.local.'
          : 'No se pudieron cargar las aclaraciones y los temas.',
      );
    }

    const [clarificationsPayload, clustersPayload]: unknown[] =
      await Promise.all([
        clarificationsResponse.json(),
        clustersResponse.json(),
      ]);
    if (!Array.isArray(clarificationsPayload) || !Array.isArray(clustersPayload)) {
      throw new Error('El servicio devolvió datos no válidos.');
    }
    setClarifications(clarificationsPayload.map(parseClarification));
    setClusters(clustersPayload.map(parseClusterOption));
  }, []);

  useEffect(() => {
    void loadData().catch((caught: unknown) => {
      console.error('Could not load institutional clarifications', caught);
      setError(
        caught instanceof Error
          ? caught.message
          : 'No se pudieron cargar las aclaraciones.',
      );
    });
  }, [loadData]);

  async function createDraft() {
    if (!clusterId) {
      setError('Selecciona un tema para preparar una aclaración.');
      return;
    }
    await runAction(
      '/api/clarifications/drafts/from-cluster',
      'POST',
      { clusterId },
    );
  }

  async function saveDraft(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await runAction(`/api/clarifications/${encodeURIComponent(id)}`, 'PATCH', {
      title: formData.get('title'),
      content: formData.get('content'),
    });
  }

  async function runAction(
    path: string,
    method: 'POST' | 'PATCH',
    body?: Record<string, unknown>,
  ) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(path, {
        method,
        headers: { 'content-type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (!response.ok) {
        throw new Error(
          response.status === 401 || response.status === 503
            ? 'La clave institucional no está configurada o no es válida.'
            : 'No se pudo completar la acción. Revisa el estado de la aclaración.',
        );
      }
      await loadData();
    } catch (caught) {
      console.error('Could not update institutional clarification', caught);
      setError(
        caught instanceof Error
          ? caught.message
          : 'No se pudo completar la acción.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dashboard-tool">
      <section className="dashboard-panel">
        <h2>Crear borrador desde el radar</h2>
        <p>
          La propuesta usa el resumen del tema y un comunicado publicado
          asociado. Todo borrador debe ser revisado antes de publicarse.
        </p>
        <div className="form-field">
          <label htmlFor="clarification-cluster">Tema del radar</label>
          <select
            id="clarification-cluster"
            value={clusterId}
            onChange={(event) => setClusterId(event.target.value)}
          >
            <option value="">Selecciona un tema</option>
            {clusters.map((cluster) => (
              <option value={cluster.id} key={cluster.id}>
                {cluster.title}
              </option>
            ))}
          </select>
        </div>
        <button
          className="button button--primary"
          type="button"
          onClick={createDraft}
          disabled={busy || !clusterId}
        >
          {busy ? 'Preparando…' : 'Generar borrador'}
        </button>
      </section>

      {error && (
        <p className="form-message" role="alert">
          {error}
        </p>
      )}

      {clarifications.length === 0 ? (
        <p>No hay aclaraciones registradas.</p>
      ) : (
        <div className="dashboard-card-grid">
          {clarifications.map((clarification) => (
            <article className="dashboard-panel" key={clarification.id}>
              <div className="dashboard-card__meta">
                <span className="dashboard-status">
                  {statusLabel(clarification.status)}
                </span>
                <span>
                  {clarification.cluster?.title ??
                    clarification.communique?.title ??
                    'Sin tema vinculado'}
                </span>
              </div>
              {clarification.status === 'DRAFT' ? (
                <form
                  className="clarification-edit-form"
                  onSubmit={(event) => void saveDraft(event, clarification.id)}
                >
                  <div className="form-field">
                    <label htmlFor={`title-${clarification.id}`}>Título</label>
                    <input
                      id={`title-${clarification.id}`}
                      name="title"
                      defaultValue={clarification.title}
                      maxLength={240}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor={`content-${clarification.id}`}>
                      Contenido
                    </label>
                    <textarea
                      id={`content-${clarification.id}`}
                      name="content"
                      defaultValue={clarification.content}
                      maxLength={5_000}
                      rows={5}
                      required
                    />
                  </div>
                  <div className="dashboard-tool__actions">
                    <button
                      className="button button--secondary"
                      type="submit"
                      disabled={busy}
                    >
                      Guardar cambios
                    </button>
                    <button
                      className="button button--primary"
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void runAction(
                          `/api/clarifications/${encodeURIComponent(clarification.id)}/submit-for-review`,
                          'POST',
                        )
                      }
                    >
                      Enviar a revisión
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2>{clarification.title}</h2>
                  <p>{clarification.content}</p>
                  {clarification.status === 'IN_REVIEW' && (
                    <button
                      className="button button--primary"
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void runAction(
                          `/api/clarifications/${encodeURIComponent(clarification.id)}/publish`,
                          'POST',
                        )
                      }
                    >
                      Aprobar y publicar
                    </button>
                  )}
                  {clarification.status === 'PUBLISHED' && (
                    <p className="form-note">
                      Visible en la página pública del comunicado vinculado.
                    </p>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function parseClarification(value: unknown): ReviewClarification {
  if (
    !isRecord(value) ||
    typeof value['id'] !== 'string' ||
    typeof value['title'] !== 'string' ||
    typeof value['content'] !== 'string' ||
    !isClarificationStatus(value['status']) ||
    !(typeof value['clusterId'] === 'string' || value['clusterId'] === null)
  ) {
    throw new Error('El servicio devolvió una aclaración no válida.');
  }
  return {
    id: value['id'],
    title: value['title'],
    content: value['content'],
    status: value['status'],
    clusterId: value['clusterId'],
    cluster: parseRelation(value['cluster']),
    communique: parseCommuniqueRelation(value['communique']),
  };
}

function parseClusterOption(value: unknown): ClusterOption {
  if (
    !isRecord(value) ||
    typeof value['id'] !== 'string' ||
    typeof value['title'] !== 'string'
  ) {
    throw new Error('El servicio devolvió un tema no válido.');
  }
  return { id: value['id'], title: value['title'] };
}

function parseRelation(
  value: unknown,
): ReviewClarification['cluster'] {
  if (value === null) {
    return null;
  }
  if (
    !isRecord(value) ||
    typeof value['id'] !== 'string' ||
    typeof value['title'] !== 'string'
  ) {
    throw new Error('El servicio devolvió una relación no válida.');
  }
  return { id: value['id'], title: value['title'] };
}

function parseCommuniqueRelation(
  value: unknown,
): ReviewClarification['communique'] {
  if (value === null) {
    return null;
  }
  if (
    !isRecord(value) ||
    typeof value['slug'] !== 'string' ||
    typeof value['title'] !== 'string'
  ) {
    throw new Error('El servicio devolvió un comunicado no válido.');
  }
  return { slug: value['slug'], title: value['title'] };
}

function isClarificationStatus(
  value: unknown,
): value is ClarificationStatus {
  return value === 'DRAFT' || value === 'IN_REVIEW' || value === 'PUBLISHED';
}

function statusLabel(status: ClarificationStatus): string {
  if (status === 'DRAFT') {
    return 'Borrador';
  }
  if (status === 'IN_REVIEW') {
    return 'En revisión';
  }
  return 'Publicado';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
