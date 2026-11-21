import { createHmac, timingSafeEqual } from 'node:crypto';

export const INSTITUTION_SESSION_COOKIE = 'rimay_institution_session';
export const INSTITUTION_SESSION_SECONDS = 8 * 60 * 60;

export function createInstitutionSessionToken(): string | null {
  const secret = process.env.INSTITUTION_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    return null;
  }
  const expiresAt = Date.now() + INSTITUTION_SESSION_SECONDS * 1_000;
  const payload = String(expiresAt);
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function isInstitutionSessionValid(token: string | undefined): boolean {
  const secret = process.env.INSTITUTION_SESSION_SECRET;
  if (!token || !secret || secret.length < 32) {
    return false;
  }

  const [expiresAtText, signature] = token.split('.');
  if (
    !expiresAtText ||
    !signature ||
    !/^\d+$/.test(expiresAtText) ||
    !/^[0-9a-f]{64}$/.test(signature)
  ) {
    return false;
  }

  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  const expected = createHmac('sha256', secret)
    .update(expiresAtText)
    .digest();
  const supplied = Buffer.from(signature, 'hex');
  return timingSafeEqual(expected, supplied);
}
