import Link from 'next/link';
import { publicCommuniques } from '../../../shared/mocks/public-communiques';

const dateFormatter = new Intl.DateTimeFormat('es-BO', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

export default function DashboardCommuniquesPage() {
  return (
    <section className="dashboard-page" aria-labelledby="dashboard-communiques-title">
      <header className="dashboard-page__header">
        <p className="section-kicker">Publicación</p>
        <h1 id="dashboard-communiques-title">Comunicados</h1>
        <p>
          Ejemplos de comunicados públicos disponibles para revisar. Este panel
          no permite crear ni editar publicaciones.
        </p>
      </header>
      <div className="dashboard-card-grid">
        {publicCommuniques.map((communique) => (
          <article className="dashboard-panel dashboard-communique" key={communique.id}>
            <div className="dashboard-card__meta">
              <span className="dashboard-status">{communique.category}</span>
              <time dateTime={communique.publishedAt}>
                {dateFormatter.format(new Date(communique.publishedAt))}
              </time>
            </div>
            <h2>{communique.title}</h2>
            <p>{communique.summary}</p>
            <Link className="text-link" href={`/c/${communique.id}`}>
              Ver vista ciudadana <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
