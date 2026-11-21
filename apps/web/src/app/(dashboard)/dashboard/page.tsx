import Link from 'next/link';
import { publicCommuniques } from '../../../shared/mocks/public-communiques';
import {
  dashboardGaps,
  draftClarifications,
  questionClusters,
} from '../../../shared/mocks/institutional-dashboard';

const metrics = [
  {
    label: 'Comunicados de ejemplo',
    value: publicCommuniques.length,
    href: '/comunicados',
  },
  { label: 'Puntos por revisar', value: dashboardGaps.length, href: '/brechas' },
  {
    label: 'Temas de consulta',
    value: questionClusters.length,
    href: '/radar',
  },
  {
    label: 'Aclaraciones propuestas',
    value: draftClarifications.length,
    href: '/aclaraciones',
  },
];

export default function DashboardPage() {
  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <header className="dashboard-page__header">
        <p className="section-kicker">Vista general</p>
        <h1 id="dashboard-title">Panel institucional</h1>
        <p>
          Revisa ejemplos de comunicados, información que conviene completar y
          temas que generan preguntas en la comunidad.
        </p>
      </header>

      <section className="dashboard-metrics" aria-label="Resumen de demostración">
        {metrics.map((metric) => (
          <Link className="dashboard-metric" href={metric.href} key={metric.href}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <span className="dashboard-metric__link">Ver sección →</span>
          </Link>
        ))}
      </section>

      <div className="dashboard-overview">
        <section className="dashboard-panel" aria-labelledby="recent-title">
          <div className="dashboard-panel__heading">
            <div>
              <p className="eyebrow">Publicación</p>
              <h2 id="recent-title">Comunicados de ejemplo</h2>
            </div>
            <Link className="text-link" href="/comunicados">
              Ver todos <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className="dashboard-list">
            {publicCommuniques.map((communique) => (
              <li className="dashboard-list__item" key={communique.id}>
                <div>
                  <h3>{communique.title}</h3>
                  <p>{communique.summary}</p>
                </div>
                <span className="dashboard-status">{communique.category}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="dashboard-panel" aria-labelledby="review-title">
          <div className="dashboard-panel__heading">
            <div>
              <p className="eyebrow">Siguiente paso</p>
              <h2 id="review-title">Revisión sugerida</h2>
            </div>
          </div>
          <ul className="dashboard-action-list">
            <li>
              <Link href="/brechas">
                <strong>Completar información clave</strong>
                <span>Revisa fechas, lugares y requisitos.</span>
              </Link>
            </li>
            <li>
              <Link href="/radar">
                <strong>Entender las dudas frecuentes</strong>
                <span>Consulta los temas agrupados en esta demostración.</span>
              </Link>
            </li>
            <li>
              <Link href="/aclaraciones">
                <strong>Revisar propuestas de aclaración</strong>
                <span>Las instituciones mantienen el control editorial.</span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </section>
  );
}
