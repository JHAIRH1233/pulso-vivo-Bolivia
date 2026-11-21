import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" href="/" aria-label="Rimay, ir al inicio">
            <Image
              className="brand__image"
              src="/rimay-logo.jpeg"
              alt="Rimay: tu idioma, tu voz, tu municipio"
              width={1200}
              height={900}
              priority
            />
          </Link>
          <details className="site-menu">
            <summary aria-label="Abrir menú">
              <span className="site-menu__icon" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </summary>
            <nav className="site-menu__panel" aria-label="Navegación principal">
              <Link href="/">Inicio</Link>
              <Link href="/#comunicados">Ver comunicados</Link>
              <Link href="/preguntar">Preguntar a Rimay</Link>
              <Link href="/dashboard">Panel institucional (demo)</Link>
              <Link href="/#para-instituciones">Instituciones</Link>
            </nav>
          </details>
        </div>
      </header>
      <main className="app-main" id="contenido">
        {children}
      </main>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <Image
              src="/rimay-logo.jpeg"
              alt=""
              width={1200}
              height={900}
            />
            <p>
              Tu idioma, tu voz y tu municipio. Un proyecto para acercar la
              información pública en español, palabras simples y quechua.
            </p>
          </div>
          <nav
            className="site-footer__links"
            aria-label="Enlaces de ciudadanía"
          >
            <h2>Ciudadanía</h2>
            <Link href="/#comunicados">Ver comunicados</Link>
            <Link href="/preguntar">Preguntar a Rimay</Link>
          </nav>
          <nav
            className="site-footer__links"
            aria-label="Enlaces de instituciones"
          >
            <h2>Instituciones</h2>
            <Link href="/#para-instituciones">Cómo funciona</Link>
            <Link href="/dashboard">Panel institucional (demo)</Link>
          </nav>
        </div>
        <div className="site-footer__bottom">
          <p>© 2026 Rimay · Bolivia</p>
          <p>Español · Palabras simples · Quechua</p>
        </div>
      </footer>
    </div>
  );
}
