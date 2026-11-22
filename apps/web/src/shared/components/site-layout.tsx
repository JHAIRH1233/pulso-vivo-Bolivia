'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const alliedLinks = [
  {
    nombre: 'Alcaldía de Cochabamba',
    url: 'https://www.cochabamba.bo/',
  },
  {
    nombre: 'Innova Cochabamba (consulta Atlas)',
    url: 'https://innova.cochabamba.bo/menu-consultaAtlas',
  },
  {
    nombre: 'Portal del Estado: GAM de Cochabamba',
    url: 'https://www.gob.bo/entidades/gobierno-autonomo-municipal-de-cochabamba',
  },
  {
    nombre: 'Universidad Mayor de San Simón (UMSS)',
    url: 'https://www.umss.edu.bo',
  },
];

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isPuntosCalientes = pathname === '/puntos-calientes';

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      {/* 1. Navbar matching base44 exact */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-md">
        <div className="page-container flex h-16 items-center justify-between gap-3 md:h-20">
          {/* Logo on the left */}
          <Link href="/" className="flex items-center gap-2" aria-label="Rimay, ir al inicio">
            <Image
              src="/rimay-logo.png"
              alt="Rimay"
              width={130}
              height={42}
              className="h-9 w-auto md:h-11"
              priority
            />
          </Link>

          {/* Center Navigation links with pill highlight */}
          <nav className="hidden items-center gap-2 md:flex" aria-label="Navegación principal">
            <Link
              href="/"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                isHome
                  ? 'bg-secondary text-primary'
                  : 'text-foreground/75 hover:bg-secondary hover:text-primary'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/puntos-calientes"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                isPuntosCalientes
                  ? 'bg-secondary text-primary'
                  : 'text-foreground/75 hover:bg-secondary hover:text-primary'
              }`}
            >
              Puntos calientes
            </Link>
          </nav>

          {/* Right Action Buttons: Iniciar sesión & Registrarme */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground/80 transition hover:border-primary/50 hover:bg-secondary hover:text-primary"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Registrarme
            </Link>
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-foreground/70 hover:bg-secondary hover:text-primary"
              aria-label="Abrir menú"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-border bg-background px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-base font-semibold ${
                  isHome ? 'bg-secondary text-primary' : 'text-foreground/80 hover:bg-secondary'
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/puntos-calientes"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-base font-semibold ${
                  isPuntosCalientes ? 'bg-secondary text-primary' : 'text-foreground/80 hover:bg-secondary'
                }`}
              >
                Puntos calientes
              </Link>
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-border px-4 py-2 text-center text-sm font-semibold"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
                >
                  Registrarme
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* 2. Full Dark Footer matching base44 exact (Lila oscuro / morado fondo #1E1037) */}
      <footer
        className="mt-16 bg-foreground text-background sm:mt-24"
        style={{ backgroundColor: '#1E1037', color: '#ffffff' }}
      >
        <div className="page-container py-14 sm:py-20">
          {/* Top CTA Banner: ¡Hagamos que todos nos entendamos! */}
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
              ¡Hagamos que todos nos entendamos!
            </h2>
            <p className="mt-4 text-base text-white/85">
              ¿Eres una institución, medio de comunicación u organización?
            </p>
            <p className="mt-1 text-base text-white/85">
              ¡Convirtámonos en aliados y llevemos la comunicación sin barreras a más personas!
            </p>

            <p className="mt-6 font-heading text-xl font-semibold text-white">
              ¡Conectemos!
            </p>
            <a
              href="mailto:rimay@gmail.com"
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#FFB627]/50 px-5 py-2.5 text-base font-semibold text-[#FFB627] transition duration-300 hover:-translate-y-0.5 hover:border-[#FFB627] hover:shadow-[0_0_24px_rgba(255,182,39,0.45)]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>rimay@gmail.com</span>
            </a>
          </div>

          {/* Middle 2 columns: Brand Logo Card + Fuentes Oficiales */}
          <div className="mt-12 grid gap-10 border-t border-white/15 pt-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="inline-flex rounded-2xl bg-white p-2 shadow-sm">
                <Image
                  src="/rimay-logo.png"
                  alt="Rimay"
                  width={110}
                  height={34}
                  className="h-11 w-auto object-contain"
                />
              </span>
              <p className="mt-4 font-heading text-xl font-bold text-white sm:text-2xl">
                Tu idioma. Tu voz. Tu municipio.
              </p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-[#FFB627]">
                ENTENDERNOS NOS CONECTA
              </p>
            </div>

            <div>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/60">
                Fuentes oficiales
              </h3>
              <ul className="mt-4 space-y-3">
                {alliedLinks.map((item) => (
                  <li key={item.nombre}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-start gap-2 text-sm font-semibold text-white/80 transition hover:text-primary"
                    >
                      <span>{item.nombre}</span>
                      <svg
                        className="h-3.5 w-3.5 text-white/40 transition group-hover:text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-white/70">
                <Link href="/" className="transition hover:text-white">
                  Inicio
                </Link>
                <Link href="/puntos-calientes" className="transition hover:text-white">
                  Puntos calientes
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="mt-12 border-t border-white/15 pt-8 text-xs text-white/60 sm:flex sm:items-center sm:justify-between">
            <p>© 2026 Rimay. Diseñado con ❤️ y mucha IA en Bolivia</p>
            <p className="mt-2 sm:mt-0">Prototipo de demostración, no afiliado a ninguna institución oficial.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
