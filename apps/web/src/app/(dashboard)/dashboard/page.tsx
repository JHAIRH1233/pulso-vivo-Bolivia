import Link from 'next/link';
import { getPublishedCommuniques } from '../../../shared/api/public-communiques';

export const dynamic = 'force-dynamic';

const workflows = [
  {
    href: '/brechas',
    title: 'Revisar un comunicado',
    description:
      'Detecta información faltante y prepara una versión en palabras simples.',
  },
  {
    href: '/radar',
    title: 'Escuchar preguntas',
    description: 'Agrupa las preguntas pendientes por tema.',
  },
  {
    href: '/aclaraciones',
    title: 'Preparar aclaraciones',
    description:
      'Edita borradores, envíalos a revisión y publica respuestas confirmadas.',
  },
];

export default async function DashboardPage() {
  let communiqueCount: number | null = null;
  try {
    communiqueCount = (await getPublishedCommuniques()).length;
  } catch (error) {
    console.error('Could not load institutional dashboard summary', error);
  }

  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <header className="dashboard-page__header">
        <p className="section-kicker">Vista general</p>
        <h1 id="dashboard-title">Panel institucional</h1>
        <p>
          Herramientas para revisar comunicados, comprender dudas y publicar
          aclaraciones con aprobación institucional.
        </p>
      </header>

      <section className="dashboard-metrics" aria-label="Comunicados publicados">
        <Link className="dashboard-metric" href="/comunicados">
          <span>Comunicados publicados disponibles</span>
          <strong>{communiqueCount ?? '—'}</strong>
          <span className="dashboard-metric__link">
            {communiqueCount === null
              ? 'No se pudo consultar la API'
              : 'Ver comunicados →'}
          </span>
        </Link>
      </section>

      <section className="dashboard-card-grid" aria-label="Flujos de trabajo">
        {workflows.map((workflow) => (
          <article className="dashboard-panel" key={workflow.href}>
            <h2>{workflow.title}</h2>
            <p>{workflow.description}</p>
            <Link className="text-link" href={workflow.href}>
              Abrir herramienta <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>
    </section>
  );
}
