import { NextRequest, NextResponse } from 'next/server';
import {
  INSTITUTION_SESSION_COOKIE,
  isInstitutionSessionValid,
} from '../../../shared/api/institution-session';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context, 'GET');
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context, 'POST');
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, context, 'PATCH');
}

async function proxy(
  request: NextRequest,
  context: RouteContext,
  method: 'GET' | 'POST' | 'PATCH',
) {
  const { path } = await context.params;
  if (!isAllowedPath(method, path)) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  if (
    requiresInstitutionSession(path) &&
    !isInstitutionSessionValid(
      request.cookies.get(INSTITUTION_SESSION_COOKIE)?.value,
    )
  ) {
    return NextResponse.json(
      { message: 'Inicia sesión para acceder a las herramientas institucionales.' },
      { status: 401 },
    );
  }
  if (
    requiresInstitutionSession(path) &&
    method !== 'GET' &&
    request.headers.get('origin') !== request.nextUrl.origin
  ) {
    return NextResponse.json({ message: 'Solicitud no válida.' }, { status: 403 });
  }

  let target: URL;
  try {
    const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:3001/api';
    const base = new URL(`${baseUrl.replace(/\/+$/, '')}/`);
    const encodedPath = path.map((segment) => encodeURIComponent(segment)).join('/');
    target = new URL(encodedPath, base);
    target.search = request.nextUrl.search;
  } catch (error) {
    console.error('Invalid API_BASE_URL configuration', error);
    return NextResponse.json(
      { message: 'La URL de la API no está configurada correctamente.' },
      { status: 500 },
    );
  }

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('content-type', contentType);
  }
  if (requiresInstitutionKey(path)) {
    const apiKey = process.env.INSTITUTION_API_KEY;
    if (apiKey) {
      headers.set('x-institution-api-key', apiKey);
    }
  }

  try {
    const upstream = await fetch(target, {
      method,
      headers,
      ...(method === 'GET' ? {} : { body: await request.text() }),
      cache: 'no-store',
      signal: AbortSignal.timeout(35_000),
    });
    const responseHeaders = new Headers();
    const upstreamContentType = upstream.headers.get('content-type');
    if (upstreamContentType) {
      responseHeaders.set('content-type', upstreamContentType);
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Could not reach API service', error);
    return NextResponse.json(
      { message: 'No se pudo conectar con el servicio. Intenta de nuevo.' },
      { status: 502 },
    );
  }
}

function isAllowedPath(method: string, path: string[]): boolean {
  const route = path.join('/');
  if (method === 'GET') {
    return (
      route === 'communiques' ||
      (path[0] === 'communiques' && path.length === 2) ||
      route === 'confusion-radar/clusters' ||
      route === 'clarifications/published' ||
      route === 'clarifications'
    );
  }

  if (method === 'PATCH') {
    return (
      path.length === 2 &&
      path[0] === 'clarifications' &&
      UUID_PATTERN.test(path[1])
    );
  }

  if (method === 'POST') {
    return (
      [
        'questions',
        'assistant/answer',
        'translation/to-quechua',
        'audio/synthesize',
        'simplifier/simplify',
        'gap-detector/analyze',
        'confusion-radar/analyze',
        'clarifications',
        'clarifications/drafts/from-cluster',
      ].includes(route) ||
      (path.length === 3 &&
        path[0] === 'clarifications' &&
        UUID_PATTERN.test(path[1]) &&
        ['submit-for-review', 'publish'].includes(path[2]))
    );
  }

  return false;
}

function requiresInstitutionKey(path: string[]): boolean {
  return (
    path[0] === 'confusion-radar' ||
    (path[0] === 'clarifications' && path[1] !== 'published') ||
    path[0] === 'gap-detector' ||
    path[0] === 'simplifier'
  );
}

function requiresInstitutionSession(path: string[]): boolean {
  return (
    path[0] === 'confusion-radar' ||
    (path[0] === 'clarifications' && path[1] !== 'published') ||
    path[0] === 'gap-detector' ||
    path[0] === 'simplifier'
  );
}
