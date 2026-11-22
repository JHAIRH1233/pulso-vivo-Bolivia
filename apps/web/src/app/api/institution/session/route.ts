import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  createInstitutionSessionToken,
  INSTITUTION_SESSION_COOKIE,
  INSTITUTION_SESSION_SECONDS,
} from '../../../../shared/api/institution-session';

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json({ message: 'Solicitud no válida.' }, { status: 403 });
  }

  const password = process.env.INSTITUTION_DASHBOARD_PASSWORD;
  const sessionToken = createInstitutionSessionToken();
  if (!password || password.length < 16 || !sessionToken) {
    return NextResponse.json(
      { message: 'El acceso institucional no está configurado.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Solicitud no válida.' }, { status: 400 });
  }
  if (
    !isRecord(body) ||
    typeof body['password'] !== 'string' ||
    body['password'].length > 512
  ) {
    return NextResponse.json({ message: 'Contraseña no válida.' }, { status: 400 });
  }

  if (!matchesPassword(body['password'], password)) {
    return NextResponse.json({ message: 'Acceso denegado.' }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(INSTITUTION_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: INSTITUTION_SESSION_SECONDS,
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json({ message: 'Solicitud no válida.' }, { status: 403 });
  }
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(INSTITUTION_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}

function matchesPassword(candidate: string, password: string): boolean {
  const candidateHash = createHash('sha256').update(candidate).digest();
  const passwordHash = createHash('sha256').update(password).digest();
  return timingSafeEqual(candidateHash, passwordHash);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
