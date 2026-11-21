import { questionClusters } from '../../../shared/mocks/institutional-dashboard';

export default function DashboardRadarPage() {
  return (
    <section className="dashboard-page" aria-labelledby="dashboard-radar-title">
      <header className="dashboard-page__header">
        <p className="section-kicker">Escucha comunitaria</p>
        <h1 id="dashboard-radar-title">Radar de dudas</h1>
        <p>
          Ejemplos de preguntas agrupadas por tema para ayudar a identificar
          qué partes de un comunicado necesitan más claridad.
        </p>
      </header>
      <div className="dashboard-card-grid">
        {questionClusters.map((cluster) => (
          <article className="dashboard-panel" key={cluster.topic}>
            <div className="dashboard-card__meta">
              <span className="dashboard-status">{cluster.trend}</span>
              <span>{cluster.count} preguntas de ejemplo</span>
            </div>
            <h2>{cluster.topic}</h2>
            <blockquote className="dashboard-evidence">
              “{cluster.example}”
            </blockquote>
            <p className="dashboard-demo-label">
              Agrupación ilustrativa; no representa preguntas reales.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
