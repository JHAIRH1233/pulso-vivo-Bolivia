import Link from 'next/link';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import {
  INSTITUTION_SESSION_COOKIE,
  isInstitutionSessionValid,
} from '../../shared/api/institution-session';
import { InstitutionLogin } from '../../shared/components/institution-login';
import { InstitutionLogout } from '../../shared/components/institution-logout';

const dashboardLinks = [
  { href: '/dashboard', label: 'Resumen' },
  { href: '/comunicados', label: 'Comunicados' },
  { href: '/brechas', label: 'Brechas' },
  { href: '/radar', label: 'Radar de dudas' },
  { href: '/aclaraciones', label: 'Aclaraciones' },
];

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const token = (await cookies()).get(INSTITUTION_SESSION_COOKIE)?.value;
  if (!isInstitutionSessionValid(token)) {
    return <InstitutionLogin />;
  }

  return (
    <div className="institutional-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header__copy">
          <p className="eyebrow">Rimay · Instituciones</p>
          <p className="dashboard-header__title">Panel de comunicación clara</p>
        </div>
        <InstitutionLogout />
        <nav className="dashboard-nav" aria-label="Panel institucional">
          {dashboardLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <p className="dashboard-demo-note" role="note">
        Las acciones se procesan mediante la API institucional. Revisa toda
        propuesta generada antes de publicarla.
      </p>
      {children}
    </div>
  );
}
