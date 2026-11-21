import Link from 'next/link';
import type { ReactNode } from 'react';

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" href="/" aria-label="Pulso Vivo Bolivia, inicio">
            <span className="brand-mark" aria-hidden="true">
              PV
            </span>
            <span className="brand-name">
              PULSO VIVO <span>Bolivia</span>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Navegación principal">
            <Link href="/">Comunicados</Link>
            <Link href="/preguntar">Hacer una pregunta</Link>
          </nav>
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="site-footer">
        <p>Comunicación institucional clara, inclusiva y accesible.</p>
      </footer>
    </div>
  );
}
