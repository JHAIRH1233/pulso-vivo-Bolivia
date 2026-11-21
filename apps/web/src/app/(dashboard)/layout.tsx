import Link from 'next/link';
import type { ReactNode } from 'react';

const dashboardLinks = [
  { href: '/dashboard', label: 'Resumen' },
  { href: '/comunicados', label: 'Comunicados' },
  { href: '/brechas', label: 'Brechas' },
  { href: '/radar', label: 'Radar de dudas' },
  { href: '/aclaraciones', label: 'Aclaraciones' },
];

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="institutional-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header__copy">
          <p className="eyebrow">Rimay · Instituciones</p>
          <p className="dashboard-header__title">Panel de comunicación clara</p>
        </div>
        <nav className="dashboard-nav" aria-label="Panel institucional">
          {dashboardLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <p className="dashboard-demo-note" role="note">
        Prototipo de demostración: los datos son ejemplos y las acciones no se
        guardan.
      </p>
      {children}
    </div>
  );
}
