import Link from 'next/link';
import { getPublishedCommuniques } from '../../../shared/api/public-communiques';

export const dynamic = 'force-dynamic';

const dateFormatter = new Intl.DateTimeFormat('es-BO', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

export default async function DashboardCommuniquesPage() {
  let communiques: Awaited<ReturnType<typeof getPublishedCommuniques>> = [];
  let loadError = false;
  try {
    communiques = await getPublishedCommuniques();
  } catch (error) {
    console.error('Could not load institutional communiques', error);
    loadError = true;
  }

  return (
    <section
      className="dashboard-page"
      aria-labelledby="dashboard-communiques-title"
    >
      <header className="dashboard-page__header">
        <p className="section-kicker">Publicación</p>
        <h1 id="dashboard-communiques-title">Comunicados</h1>
        <p>
          Comunicados publicados disponibles para revisar. La edición y
          publicación se realiza en el sistema institucional de origen.
        </p>
      </header>
      {loadError ? (
        <p className="form-message" role="alert">
          No se pudieron cargar los comunicados publicados.
        </p>
      ) : communiques.length === 0 ? (
        <p>No hay comunicados publicados.</p>
      ) : (
        <div className="dashboard-card-grid">
          {communiques.map((communique) => (
            <article
              className="dashboard-panel dashboard-communique"
              key={communique.id}
            >
              <div className="dashboard-card__meta">
                <span className="dashboard-status">{communique.language}</span>
                {communique.publishedAt && (
                  <time dateTime={communique.publishedAt}>
                    {dateFormatter.format(new Date(communique.publishedAt))}
                  </time>
                )}
              </div>
              <h2>{communique.title}</h2>
              <p>
                {communique.simplifiedContent ??
                  'Aún no hay una versión simplificada.'}
              </p>
              <Link className="text-link" href={`/c/${communique.slug}`}>
                Ver vista ciudadana <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
