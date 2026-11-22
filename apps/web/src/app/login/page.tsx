'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'ciudadano' | 'institucional'>('ciudadano');
  
  // Ciudadano fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [citizenSuccess, setCitizenSuccess] = useState(false);

  // Institucional fields
  const [instPassword, setInstPassword] = useState('');
  const [instError, setInstError] = useState('');
  const [instBusy, setInstBusy] = useState(false);

  async function handleCitizenSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCitizenSuccess(true);
    setTimeout(() => {
      router.push('/');
    }, 1500);
  }

  async function handleInstSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInstBusy(true);
    setInstError('');
    try {
      const response = await fetch('/api/institution/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: instPassword }),
      });
      if (!response.ok) {
        setInstError(
          response.status === 503
            ? 'El acceso institucional no está configurado.'
            : 'Contraseña incorrecta. Verifica tus credenciales municipales.',
        );
        return;
      }
      router.push('/dashboard');
    } catch {
      setInstError('No se pudo conectar con el servicio de acceso.');
    } finally {
      setInstBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative ambient background blobs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl sm:p-8">
          {/* Logo & Heading */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/rimay-logo.png"
                alt="Rimay"
                width={120}
                height={38}
                className="mx-auto h-9 w-auto"
                priority
              />
            </Link>
            <h1 className="mt-4 font-heading text-2xl font-black text-foreground sm:text-3xl">
              ¡Bienvenido de nuevo!
            </h1>
            <p className="mt-1 text-sm text-foreground/70">
              Accede a la plataforma de comunicación clara de Bolivia
            </p>
          </div>

          {/* Tab Selector: Ciudadano vs Institución */}
          <div className="mt-6 flex rounded-2xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setTab('ciudadano')}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition sm:text-sm ${
                tab === 'ciudadano'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              🙋‍♀️ Ciudadano
            </button>
            <button
              type="button"
              onClick={() => setTab('institucional')}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition sm:text-sm ${
                tab === 'institucional'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              🏛️ Institución / Alcaldía
            </button>
          </div>

          {/* Form: Ciudadano */}
          {tab === 'ciudadano' ? (
            <form onSubmit={handleCitizenSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.bo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                    Contraseña
                  </label>
                  <a
                    href="#recuperar"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Para recuperar tu contraseña, comunícate a rimay@gmail.com');
                    }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-foreground/70">
                  Recordar mi sesión en este dispositivo
                </label>
              </div>

              {citizenSuccess ? (
                <div className="rounded-2xl bg-teal-500/10 p-3 text-center text-xs font-bold text-teal-700">
                  ✓ Sesión iniciada correctamente. Redirigiendo...
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 hover:shadow-lg"
                >
                  Iniciar sesión
                </button>
              )}

              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-border" />
                <span className="absolute bg-card px-3 text-[11px] font-semibold uppercase tracking-wider text-foreground/50">
                  o continúa con
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEmail('ciudadano.demostracion@rimay.bo');
                  setPassword('demo1234');
                }}
                className="w-full rounded-2xl border border-border bg-secondary/30 py-2.5 text-xs font-bold text-foreground transition hover:bg-secondary/60"
              >
                ⚡ Usar credencial de prueba ciudadana
              </button>
            </form>
          ) : (
            /* Form: Institucional */
            <form onSubmit={handleInstSubmit} className="mt-6 space-y-4">
              <div className="rounded-2xl bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-800">
                <span className="font-bold">Acceso para funcionarios y equipos de redacción:</span> Permite
                simplificar comunicados, analizar brechas ciudadanas y publicar aclaraciones oficiales.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Contraseña de acceso institucional
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ingresa la clave de administración"
                  value={instPassword}
                  onChange={(e) => setInstPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {instError && (
                <div className="rounded-2xl bg-red-500/10 p-3 text-xs font-medium text-red-700" role="alert">
                  {instError}
                </div>
              )}

              <button
                type="submit"
                disabled={instBusy}
                className="w-full rounded-2xl bg-accent py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-accent/90 disabled:opacity-50"
              >
                {instBusy ? 'Validando credenciales…' : 'Ingresar al Panel Institucional'}
              </button>
            </form>
          )}

          {/* Bottom link to register */}
          <p className="mt-6 text-center text-xs font-medium text-foreground/70">
            ¿Aún no tienes cuenta?{' '}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Registrarme gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
