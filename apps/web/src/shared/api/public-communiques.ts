export interface PublicCommuniqueSummary {
  id: string;
  slug: string;
  title: string;
  simplifiedContent: string | null;
  language: string;
  publishedAt: string | null;
}

export interface PublicCommunique {
  id: string;
  slug: string;
  title: string;
  content: string;
  simplifiedContent: string | null;
  language: string;
  publishedAt: string | null;
  translations: Array<{
    language: string;
    title: string;
    content: string;
    audioUrl: string | null;
  }>;
}

export interface PublicClarification {
  id: string;
  title: string;
  content: string;
  publishedAt: string | null;
}

const API_BASE_URL = (
  process.env.API_BASE_URL ?? 'http://localhost:3001/api'
).replace(/\/+$/, '');

export async function getPublishedCommuniques(): Promise<
  PublicCommuniqueSummary[]
> {
  const payload = await fetchApi('/communiques');
  if (!isRecord(payload) || !Array.isArray(payload['data'])) {
    throw new Error('La API devolvió una lista de comunicados no válida.');
  }
  return payload['data'].map(parseSummary);
}

export async function getPublishedCommunique(
  slug: string,
): Promise<PublicCommunique | null> {
  const response = await fetch(`${API_BASE_URL}/communiques/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('No se pudo cargar el comunicado.');
  }
  return parseCommunique(await response.json());
}

export async function getPublishedClarifications(
  communiqueId: string,
): Promise<PublicClarification[]> {
  const query = new URLSearchParams({ communiqueId });
  const response = await fetch(
    `${API_BASE_URL}/clarifications/published?${query.toString()}`,
    { cache: 'no-store' },
  );
  if (!response.ok) {
    throw new Error('No se pudieron cargar las aclaraciones publicadas.');
  }
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('La API devolvió una lista de aclaraciones no válida.');
  }
  return payload.map(parsePublicClarification);
}

async function fetchApi(path: string): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('No se pudieron cargar los comunicados.');
  }
  return response.json();
}

function parsePublicClarification(value: unknown): PublicClarification {
  if (
    !isRecord(value) ||
    typeof value['id'] !== 'string' ||
    typeof value['title'] !== 'string' ||
    typeof value['content'] !== 'string' ||
    !(
      typeof value['publishedAt'] === 'string' ||
      value['publishedAt'] instanceof Date ||
      value['publishedAt'] === null
    )
  ) {
    throw new Error('La API devolvió una aclaración no válida.');
  }
  return {
    id: value['id'],
    title: value['title'],
    content: value['content'],
    publishedAt:
      value['publishedAt'] instanceof Date
        ? value['publishedAt'].toISOString()
        : value['publishedAt'],
  };
}

function parseSummary(value: unknown): PublicCommuniqueSummary {
  if (
    !isRecord(value) ||
    typeof value['id'] !== 'string' ||
    typeof value['slug'] !== 'string' ||
    typeof value['title'] !== 'string' ||
    typeof value['language'] !== 'string' ||
    !(typeof value['publishedAt'] === 'string' || value['publishedAt'] === null) ||
    !(
      typeof value['simplifiedContent'] === 'string' ||
      value['simplifiedContent'] === null
    )
  ) {
    throw new Error('La API devolvió un comunicado no válido.');
  }
  return {
    id: value['id'],
    slug: value['slug'],
    title: value['title'],
    language: value['language'],
    publishedAt: value['publishedAt'],
    simplifiedContent: value['simplifiedContent'],
  };
}

function parseCommunique(value: unknown): PublicCommunique {
  if (
    !isRecord(value) ||
    typeof value['id'] !== 'string' ||
    typeof value['slug'] !== 'string' ||
    typeof value['title'] !== 'string' ||
    typeof value['content'] !== 'string' ||
    typeof value['language'] !== 'string' ||
    !(
      typeof value['publishedAt'] === 'string' ||
      value['publishedAt'] instanceof Date ||
      value['publishedAt'] === null
    ) ||
    !(
      typeof value['simplifiedContent'] === 'string' ||
      value['simplifiedContent'] === null
    ) ||
    !Array.isArray(value['translations'])
  ) {
    throw new Error('La API devolvió un comunicado no válido.');
  }

  const translations = value['translations'].map((item) => {
    if (
      !isRecord(item) ||
      typeof item['language'] !== 'string' ||
      typeof item['title'] !== 'string' ||
      typeof item['content'] !== 'string' ||
      !(typeof item['audioUrl'] === 'string' || item['audioUrl'] === null)
    ) {
      throw new Error('La API devolvió una traducción no válida.');
    }
    return {
      language: item['language'],
      title: item['title'],
      content: item['content'],
      audioUrl: item['audioUrl'],
    };
  });

  return {
    id: value['id'],
    slug: value['slug'],
    title: value['title'],
    content: value['content'],
    language: value['language'],
    publishedAt:
      value['publishedAt'] instanceof Date
        ? value['publishedAt'].toISOString()
        : value['publishedAt'],
    simplifiedContent: value['simplifiedContent'],
    translations,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
